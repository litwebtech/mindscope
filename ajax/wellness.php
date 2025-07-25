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
  logError('Database connection failed in wellness.php');
  sendJsonResponse(false, 'Database connection error. Please try again later.');
}

try {
  // Sanitize and validate input data
  $name = sanitizeInput($connection, $_POST['clientName'] ?? '');
  $email = sanitizeInput($connection, $_POST['clientEmail'] ?? '');
  $phone = sanitizeInput($connection, $_POST['clientPhone'] ?? '');
  $company = sanitizeInput($connection, $_POST['companyName'] ?? '');
  $programme_type = sanitizeInput($connection, $_POST['programmeType'] ?? '');
  $urgency_level = sanitizeInput($connection, $_POST['urgencyLevel'] ?? '');
  $main_concerns = sanitizeInput($connection, $_POST['mainConcerns'] ?? '');
  $preferred_date = sanitizeInput($connection, $_POST['preferredDate'] ?? '');
  $preferred_time = sanitizeInput($connection, $_POST['preferredTime'] ?? '');
  $consultation_type = sanitizeInput($connection, $_POST['consultationType'] ?? '');
  $previous_experience = sanitizeInput($connection, $_POST['previousExperience'] ?? '');
  $specific_goals = sanitizeInput($connection, $_POST['specificGoals'] ?? '');
  $budget_range = sanitizeInput($connection, $_POST['budgetRange'] ?? '');
  $privacy_consent = isset($_POST['privacyConsent']) ? 1 : 0;

  // Validation
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

  if (empty($programme_type)) {
    $errors[] = 'Programme type is required';
  }

  if (empty($urgency_level)) {
    $errors[] = 'Urgency level is required';
  }

  if (empty($main_concerns)) {
    $errors[] = 'Main concerns are required';
  }

  if (!$privacy_consent) {
    $errors[] = 'Privacy consent is required';
  }

  // If there are validation errors, return them
  if (!empty($errors)) {
    logError('Wellness form validation failed', ['errors' => $errors, 'email' => $email]);
    sendJsonResponse(false, implode(', ', $errors));
  }

  // Check for recent duplicate submissions (within last 15 minutes)
  $check_query = "SELECT id FROM wellness_consultations 
                    WHERE email = ? AND phone = ? 
                    AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)";

  $check_stmt = mysqli_prepare($connection, $check_query);
  if (!$check_stmt) {
    logError('Failed to prepare duplicate check query', ['error' => mysqli_error($connection)]);
    sendJsonResponse(false, 'Database error. Please try again.');
  }

  mysqli_stmt_bind_param($check_stmt, 'ss', $email, $phone);
  mysqli_stmt_execute($check_stmt);
  $check_result = mysqli_stmt_get_result($check_stmt);

  if (mysqli_num_rows($check_result) > 0) {
    mysqli_stmt_close($check_stmt);
    mysqli_close($connection);
    sendJsonResponse(false, 'You have already submitted a consultation request recently. Please wait a few minutes before submitting again.');
  }

  mysqli_stmt_close($check_stmt);

  // Insert wellness consultation into database
  $insert_query = "INSERT INTO wellness_consultations (
        name, email, phone, company, programme_type, urgency_level, main_concerns, 
        preferred_date, preferred_time, consultation_type, previous_experience, 
        specific_goals, budget_range, privacy_consent, ip_address, user_agent, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

  $insert_stmt = mysqli_prepare($connection, $insert_query);
  if (!$insert_stmt) {
    logError('Failed to prepare wellness insert query', ['error' => mysqli_error($connection)]);
    sendJsonResponse(false, 'Database error. Please try again.');
  }

  $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

  mysqli_stmt_bind_param(
    $insert_stmt,
    'ssssssssssssssss',
    $name,
    $email,
    $phone,
    $company,
    $programme_type,
    $urgency_level,
    $main_concerns,
    $preferred_date,
    $preferred_time,
    $consultation_type,
    $previous_experience,
    $specific_goals,
    $budget_range,
    $privacy_consent,
    $ip_address,
    $user_agent
  );

  if (mysqli_stmt_execute($insert_stmt)) {
    $consultation_id = mysqli_insert_id($connection);

    // Send email notification to admin
    $admin_subject = "New Wellness Consultation Request - " . $name;
    $admin_message = createAdminWellnessEmail($name, $email, $phone, $company, $programme_type, $urgency_level, $main_concerns, $preferred_date, $preferred_time, $consultation_type, $previous_experience, $specific_goals, $budget_range, $ip_address);

    sendEmail(ADMIN_EMAIL, $admin_subject, $admin_message);

    // Send confirmation email to user
    $user_subject = "Wellness Consultation Request Received - " . SITE_NAME;
    $user_message = createUserWellnessEmail($name, $programme_type, $urgency_level);

    sendEmail($email, $user_subject, $user_message);

    // Log successful submission
    logActivity('Wellness consultation submitted successfully', [
      'consultation_id' => $consultation_id,
      'name' => $name,
      'email' => $email,
      'programme_type' => $programme_type,
      'urgency_level' => $urgency_level
    ]);

    mysqli_stmt_close($insert_stmt);
    mysqli_close($connection);

    $response_message = 'Thank you! Your wellness consultation request has been submitted successfully. ';
    if ($urgency_level === 'urgent') {
      $response_message .= 'Due to the urgent nature of your request, we will contact you within 4 hours.';
    } else {
      $response_message .= 'We will contact you within 24 hours to schedule your consultation.';
    }

    sendJsonResponse(true, $response_message);
  } else {
    logError('Failed to insert wellness consultation', [
      'error' => mysqli_error($connection),
      'email' => $email
    ]);
    mysqli_stmt_close($insert_stmt);
    sendJsonResponse(false, 'Failed to submit consultation request. Please try again.');
  }
} catch (Exception $e) {
  logError('Exception in wellness.php', [
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

// Helper function to create admin email for wellness consultations
function createAdminWellnessEmail($name, $email, $phone, $company, $programme_type, $urgency_level, $main_concerns, $preferred_date, $preferred_time, $consultation_type, $previous_experience, $specific_goals, $budget_range, $ip_address)
{
  $urgency_badge = $urgency_level === 'urgent' ? '<span style="background: #ff4444; color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px;">URGENT</span>' : '';

  $html = "
    <html>
    <head>
        <title>New Wellness Consultation Request</title>
    </head>
    <body>
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <h2 style='color: #4B002E;'>New Wellness Consultation Request {$urgency_badge}</h2>
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
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Programme Type:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($programme_type) . "</td>
                </tr>
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Urgency Level:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($urgency_level) . "</td>
                </tr>
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Main Concerns:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . nl2br(htmlspecialchars($main_concerns)) . "</td>
                </tr>";

  if (!empty($preferred_date)) {
    $html .= "
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Preferred Date:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($preferred_date) . "</td>
                </tr>";
  }

  if (!empty($preferred_time)) {
    $html .= "
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Preferred Time:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($preferred_time) . "</td>
                </tr>";
  }

  if (!empty($consultation_type)) {
    $html .= "
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Consultation Type:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($consultation_type) . "</td>
                </tr>";
  }

  if (!empty($previous_experience)) {
    $html .= "
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Previous Experience:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . nl2br(htmlspecialchars($previous_experience)) . "</td>
                </tr>";
  }

  if (!empty($specific_goals)) {
    $html .= "
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Specific Goals:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . nl2br(htmlspecialchars($specific_goals)) . "</td>
                </tr>";
  }

  if (!empty($budget_range)) {
    $html .= "
                <tr>
                    <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Budget Range:</td>
                    <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($budget_range) . "</td>
                </tr>";
  }

  $html .= "
            </table>
            <p style='margin-top: 20px; font-size: 12px; color: #666;'>
                Submitted on: " . date('Y-m-d H:i:s') . "<br>
                IP Address: {$ip_address}
            </p>";

  if ($urgency_level === 'urgent') {
    $html .= "
            <div style='background: #ffeeee; border: 2px solid #ff4444; padding: 15px; margin-top: 20px; border-radius: 5px;'>
                <h3 style='color: #ff4444; margin: 0 0 10px 0;'>⚠️ URGENT REQUEST</h3>
                <p style='margin: 0; font-weight: bold;'>This client has marked their request as urgent. Please prioritize and respond within 4 hours.</p>
            </div>";
  }

  $html .= "
        </div>
    </body>
    </html>";

  return $html;
}

// Helper function to create user confirmation email
function createUserWellnessEmail($name, $programme_type, $urgency_level)
{
  $response_time = $urgency_level === 'urgent' ? '4 hours' : '24 hours';

  $html = "
    <html>
    <head>
        <title>Wellness Consultation Request Received</title>
    </head>
    <body>
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <h2 style='color: #4B002E;'>Thank you for your Wellness Consultation request!</h2>
            <p>Dear " . htmlspecialchars($name) . ",</p>
            <p>We have received your request for a <strong>" . htmlspecialchars($programme_type) . "</strong> consultation and our wellness team is reviewing your requirements.</p>
            
            <div style='background: #f9f9f9; padding: 15px; border-left: 4px solid #4B002E; margin: 20px 0;'>
                <h3>What happens next?</h3>
                <ul>
                    <li>Our wellness specialist will review your concerns and goals</li>
                    <li>We'll contact you within <strong>{$response_time}</strong> to schedule your consultation</li>
                    <li>We'll prepare a personalized approach based on your specific needs</li>
                    <li>Your consultation will be completely confidential and professional</li>
                </ul>
            </div>";

  if ($urgency_level === 'urgent') {
    $html .= "
            <div style='background: #fff3cd; border: 1px solid #ffeeba; padding: 15px; margin: 20px 0; border-radius: 5px;'>
                <h4 style='color: #856404; margin: 0 0 10px 0;'>⚡ Urgent Request Noted</h4>
                <p style='margin: 0; color: #856404;'>We understand the urgent nature of your request and will prioritize your consultation accordingly.</p>
            </div>";
  }

  $html .= "
            <div style='background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                <h4 style='color: #2e7d32; margin: 0 0 10px 0;'>🛡️ Privacy & Confidentiality</h4>
                <p style='margin: 0; color: #2e7d32;'>All information shared will be kept strictly confidential in accordance with our privacy policy and professional ethics.</p>
            </div>
            
            <p>If you have any immediate questions or concerns, please contact us:</p>
            <ul>
                <li>Phone: +254 700 000 000</li>
                <li>Email: " . SITE_EMAIL . "</li>
                <li>WhatsApp: +254 700 000 000</li>
            </ul>
            
            <p>We look forward to supporting your wellness journey.</p>
            <p>Best regards,<br>" . SITE_NAME . " Wellness Team</p>
        </div>
    </body>
    </html>";

  return $html;
}
