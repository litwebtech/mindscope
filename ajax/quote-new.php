<?php
require_once '../includes/config.php';

// Set content type to JSON
header('Content-Type: application/json');

// Check if request is POST and AJAX
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isAjax()) {
  sendJsonResponse(false, 'Invalid request method');
}

// Get database connection
$connection = getConnection();
if (!$connection) {
  logError('Database connection failed in quote.php');
  sendJsonResponse(false, 'Database connection error. Please try again later.');
}

try {
  // Determine form type
  $form_type = sanitizeInput($connection, $_POST['form_type'] ?? '');

  if (empty($form_type)) {
    sendJsonResponse(false, 'Form type is required');
  }

  // Common fields for all quote forms
  $name = sanitizeInput($connection, $_POST['name'] ?? $_POST['clientName'] ?? '');
  $email = sanitizeInput($connection, $_POST['email'] ?? $_POST['clientEmail'] ?? '');
  $phone = sanitizeInput($connection, $_POST['phone'] ?? $_POST['clientPhone'] ?? '');
  $company = sanitizeInput($connection, $_POST['company'] ?? $_POST['companyName'] ?? '');
  $message = sanitizeInput($connection, $_POST['message'] ?? $_POST['additionalInfo'] ?? $_POST['specialRequests'] ?? $_POST['projectDescription'] ?? '');

  // Validation for common fields
  $errors = [];

  if (empty($name)) {
    $errors[] = 'Name is required';
  }

  if (empty($email)) {
    $errors[] = 'Email is required';
  } elseif (!isValidEmail($email)) {
    $errors[] = 'Please enter a valid email address';
  }

  if (empty($phone)) {
    $errors[] = 'Phone number is required';
  } elseif (!isValidPhone($phone)) {
    $errors[] = 'Please enter a valid phone number';
  }

  // Form-specific data and validation
  $service_details = [];

  switch ($form_type) {
    case 'catering':
      $service_details = [
        'event_type' => sanitizeInput($connection, $_POST['eventType'] ?? ''),
        'event_date' => sanitizeInput($connection, $_POST['eventDate'] ?? ''),
        'event_time' => sanitizeInput($connection, $_POST['eventTime'] ?? ''),
        'guest_count' => sanitizeInput($connection, $_POST['guestCount'] ?? ''),
        'venue' => sanitizeInput($connection, $_POST['venue'] ?? ''),
        'dietary_requirements' => sanitizeInput($connection, $_POST['dietaryRequirements'] ?? ''),
        'budget_range' => sanitizeInput($connection, $_POST['budgetRange'] ?? ''),
        'service_type' => sanitizeInput($connection, $_POST['serviceType'] ?? '')
      ];

      if (empty($service_details['event_type'])) {
        $errors[] = 'Event type is required';
      }
      if (empty($service_details['event_date'])) {
        $errors[] = 'Event date is required';
      }
      if (empty($service_details['guest_count'])) {
        $errors[] = 'Guest count is required';
      }

      // Validate event date is in the future
      if (!empty($service_details['event_date'])) {
        $event_date = strtotime($service_details['event_date']);
        if ($event_date < strtotime('today')) {
          $errors[] = 'Event date must be in the future';
        }
      }

      // Validate guest count is numeric and positive
      if (!empty($service_details['guest_count']) && (!is_numeric($service_details['guest_count']) || $service_details['guest_count'] < 1)) {
        $errors[] = 'Guest count must be a positive number';
      }
      break;

    case 'events':
      $service_details = [
        'event_type' => sanitizeInput($connection, $_POST['eventType'] ?? ''),
        'event_date' => sanitizeInput($connection, $_POST['eventDate'] ?? ''),
        'event_time' => sanitizeInput($connection, $_POST['eventTime'] ?? ''),
        'guest_count' => sanitizeInput($connection, $_POST['guestCount'] ?? ''),
        'venue' => sanitizeInput($connection, $_POST['venue'] ?? ''),
        'budget_range' => sanitizeInput($connection, $_POST['budgetRange'] ?? ''),
        'services_needed' => sanitizeInput($connection, $_POST['servicesNeeded'] ?? ''),
        'theme_preferences' => sanitizeInput($connection, $_POST['themePreferences'] ?? '')
      ];

      if (empty($service_details['event_type'])) {
        $errors[] = 'Event type is required';
      }
      if (empty($service_details['event_date'])) {
        $errors[] = 'Event date is required';
      }
      if (empty($service_details['guest_count'])) {
        $errors[] = 'Guest count is required';
      }
      break;

    case 'logistics':
      $service_details = [
        'service_type' => sanitizeInput($connection, $_POST['serviceType'] ?? ''),
        'origin_location' => sanitizeInput($connection, $_POST['originLocation'] ?? ''),
        'destination_location' => sanitizeInput($connection, $_POST['destinationLocation'] ?? ''),
        'cargo_type' => sanitizeInput($connection, $_POST['cargoType'] ?? ''),
        'cargo_weight' => sanitizeInput($connection, $_POST['cargoWeight'] ?? ''),
        'cargo_dimensions' => sanitizeInput($connection, $_POST['cargoDimensions'] ?? ''),
        'preferred_date' => sanitizeInput($connection, $_POST['preferredDate'] ?? ''),
        'urgency_level' => sanitizeInput($connection, $_POST['urgencyLevel'] ?? ''),
        'insurance_required' => isset($_POST['insuranceRequired']) ? 1 : 0
      ];

      if (empty($service_details['service_type'])) {
        $errors[] = 'Service type is required';
      }
      if (empty($service_details['origin_location'])) {
        $errors[] = 'Origin location is required';
      }
      if (empty($service_details['destination_location'])) {
        $errors[] = 'Destination location is required';
      }
      break;

    case 'consulting':
      $service_details = [
        'service_needed' => sanitizeInput($connection, $_POST['serviceNeeded'] ?? ''),
        'project_scope' => sanitizeInput($connection, $_POST['projectScope'] ?? ''),
        'timeline' => sanitizeInput($connection, $_POST['timeline'] ?? ''),
        'budget_range' => sanitizeInput($connection, $_POST['budgetRange'] ?? ''),
        'industry' => sanitizeInput($connection, $_POST['industry'] ?? ''),
        'current_challenges' => sanitizeInput($connection, $_POST['currentChallenges'] ?? ''),
        'expected_outcomes' => sanitizeInput($connection, $_POST['expectedOutcomes'] ?? '')
      ];

      if (empty($service_details['service_needed'])) {
        $errors[] = 'Service needed is required';
      }
      if (empty($message)) {
        $errors[] = 'Project description is required';
      }
      break;

    default:
      $errors[] = 'Invalid form type';
      break;
  }

  // If there are validation errors, return them
  if (!empty($errors)) {
    logError('Quote form validation failed', ['errors' => $errors, 'form_type' => $form_type, 'email' => $email]);
    sendJsonResponse(false, implode(', ', $errors));
  }

  // Check for recent duplicate submissions (within last 10 minutes)
  $check_query = "SELECT id FROM quote_requests 
                    WHERE email = ? AND phone = ? AND form_type = ?
                    AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)";

  $check_stmt = mysqli_prepare($connection, $check_query);
  if (!$check_stmt) {
    logError('Failed to prepare duplicate check query', ['error' => mysqli_error($connection)]);
    sendJsonResponse(false, 'Database error. Please try again.');
  }

  mysqli_stmt_bind_param($check_stmt, 'sss', $email, $phone, $form_type);
  mysqli_stmt_execute($check_stmt);
  $check_result = mysqli_stmt_get_result($check_stmt);

  if (mysqli_num_rows($check_result) > 0) {
    mysqli_stmt_close($check_stmt);
    mysqli_close($connection);
    sendJsonResponse(false, 'You have already submitted a quote request recently. Please wait a few minutes before submitting again.');
  }

  mysqli_stmt_close($check_stmt);

  // Insert quote request into database
  $insert_query = "INSERT INTO quote_requests (name, email, phone, company, form_type, service_details, message, ip_address, user_agent, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

  $insert_stmt = mysqli_prepare($connection, $insert_query);
  if (!$insert_stmt) {
    logError('Failed to prepare quote insert query', ['error' => mysqli_error($connection)]);
    sendJsonResponse(false, 'Database error. Please try again.');
  }

  $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
  $service_details_json = json_encode($service_details);

  mysqli_stmt_bind_param(
    $insert_stmt,
    'sssssssss',
    $name,
    $email,
    $phone,
    $company,
    $form_type,
    $service_details_json,
    $message,
    $ip_address,
    $user_agent
  );

  if (mysqli_stmt_execute($insert_stmt)) {
    $quote_id = mysqli_insert_id($connection);

    // Send email notification to admin
    $admin_subject = "New " . ucfirst($form_type) . " Quote Request - " . $name;
    $admin_message = createAdminQuoteEmail($name, $email, $phone, $company, $form_type, $service_details, $message, $ip_address);

    sendEmail(ADMIN_EMAIL, $admin_subject, $admin_message);

    // Send confirmation email to user
    $user_subject = "Quote Request Received - " . SITE_NAME;
    $user_message = createUserQuoteEmail($name, $form_type, $service_details);

    sendEmail($email, $user_subject, $user_message);

    // Log successful submission
    logActivity('Quote request submitted successfully', [
      'quote_id' => $quote_id,
      'name' => $name,
      'email' => $email,
      'form_type' => $form_type
    ]);

    mysqli_stmt_close($insert_stmt);
    mysqli_close($connection);

    sendJsonResponse(true, 'Thank you! Your quote request has been submitted successfully. We will contact you within 24 hours with a detailed quote.');
  } else {
    logError('Failed to insert quote request', [
      'error' => mysqli_error($connection),
      'email' => $email,
      'form_type' => $form_type
    ]);
    mysqli_stmt_close($insert_stmt);
    sendJsonResponse(false, 'Failed to submit quote request. Please try again.');
  }
} catch (Exception $e) {
  logError('Exception in quote.php', [
    'message' => $e->getMessage(),
    'file' => $e->getFile(),
    'line' => $e->getLine()
  ]);
  sendJsonResponse(false, 'An unexpected error occurred. Please try again later.');
} finally {
  if (isset($connection) && $connection) {
    mysqli_close($connection);
  }
}

// Helper function to create admin email for quote requests
function createAdminQuoteEmail($name, $email, $phone, $company, $form_type, $service_details, $message, $ip_address)
{
  $html = "
    <html>
    <head>
        <title>New " . ucfirst($form_type) . " Quote Request</title>
    </head>
    <body>
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <h2 style='color: #4B002E;'>New " . ucfirst($form_type) . " Quote Request</h2>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Name:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($name) . "</td>
                </tr>
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Email:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($email) . "</td>
                </tr>
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Phone:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($phone) . "</td>
                </tr>";

  if (!empty($company)) {
    $html .= "
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Company:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($company) . "</td>
                </tr>";
  }

  $html .= "
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Service Type:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . ucfirst($form_type) . "</td>
                </tr>";

  // Add service-specific details
  foreach ($service_details as $key => $value) {
    if (!empty($value)) {
      $label = ucwords(str_replace('_', ' ', $key));
      $html .= "
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>{$label}:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($value) . "</td>
                </tr>";
    }
  }

  if (!empty($message)) {
    $html .= "
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Additional Information:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . nl2br(htmlspecialchars($message)) . "</td>
                </tr>";
  }

  $html .= "
            </table>
            <p style='margin-top: 20px; font-size: 12px; color: #666;'>
                Submitted on: " . date('Y-m-d H:i:s') . "<br>
                IP Address: {$ip_address}
            </p>
        </div>
    </body>
    </html>";

  return $html;
}

// Helper function to create user confirmation email
function createUserQuoteEmail($name, $form_type, $service_details)
{
  $service_name = ucfirst($form_type);

  $html = "
    <html>
    <head>
        <title>Quote Request Received</title>
    </head>
    <body>
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <h2 style='color: #4B002E;'>Thank you for your {$service_name} quote request!</h2>
            <p>Dear " . htmlspecialchars($name) . ",</p>
            <p>We have received your {$service_name} quote request and our team is already working on preparing a detailed quote for you.</p>
            <div style='background: #f9f9f9; padding: 15px; border-left: 4px solid #4B002E; margin: 20px 0;'>
                <h3>What happens next?</h3>
                <ul>
                    <li>Our team will review your requirements within 2-4 hours</li>
                    <li>We'll contact you within 24 hours with a detailed quote</li>
                    <li>If needed, we'll schedule a consultation to discuss your specific needs</li>
                </ul>
            </div>
            <p>If you have any urgent questions, please don't hesitate to contact us:</p>
            <ul>
                <li>Phone: +254 700 000 000</li>
                <li>Email: " . SITE_EMAIL . "</li>
            </ul>
            <p>Best regards,<br>" . SITE_NAME . " Team</p>
        </div>
    </body>
    </html>";

  return $html;
}
