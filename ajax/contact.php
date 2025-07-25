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
  logError('Database connection failed in contact.php');
  sendJsonResponse(false, 'Database connection error. Please try again later.');
}

try {
  // Sanitize and validate input data
  $name = sanitizeInput($connection, $_POST['name'] ?? '');
  $email = sanitizeInput($connection, $_POST['email'] ?? '');
  $phone = sanitizeInput($connection, $_POST['phone'] ?? '');
  $subject = sanitizeInput($connection, $_POST['subject'] ?? '');
  $message = sanitizeInput($connection, $_POST['message'] ?? '');
  $service_type = sanitizeInput($connection, $_POST['service_type'] ?? '');
  $newsletter = isset($_POST['newsletter']) ? 1 : 0;

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

  if (empty($subject)) {
    $errors[] = 'Subject is required';
  }

  if (empty($message)) {
    $errors[] = 'Message is required';
  }

  if (empty($service_type)) {
    $errors[] = 'Service type is required';
  }

  // If there are validation errors, return them
  if (!empty($errors)) {
    logError('Contact form validation failed', ['errors' => $errors, 'email' => $email]);
    sendJsonResponse(false, implode(', ', $errors));
  }

  // Check for recent duplicate submissions (within last 5 minutes)
  $check_query = "SELECT id FROM contact_messages 
                    WHERE email = ? AND phone = ? 
                    AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)";

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
    sendJsonResponse(false, 'You have already submitted a message recently. Please wait a few minutes before submitting again.');
  }

  mysqli_stmt_close($check_stmt);

  // Insert contact message into database
  $insert_query = "INSERT INTO contact_messages (name, email, phone, subject, message, service_type, newsletter_opt_in, ip_address, user_agent, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

  $insert_stmt = mysqli_prepare($connection, $insert_query);
  if (!$insert_stmt) {
    logError('Failed to prepare insert query', ['error' => mysqli_error($connection)]);
    sendJsonResponse(false, 'Database error. Please try again.');
  }

  $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

  mysqli_stmt_bind_param(
    $insert_stmt,
    'ssssssiss',
    $name,
    $email,
    $phone,
    $subject,
    $message,
    $service_type,
    $newsletter,
    $ip_address,
    $user_agent
  );

  if (mysqli_stmt_execute($insert_stmt)) {
    $contact_id = mysqli_insert_id($connection);

    // If user opted for newsletter, add to newsletter table
    if ($newsletter) {
      $newsletter_query = "INSERT IGNORE INTO newsletter_subscribers (email, name, source, subscribed_at) 
                                VALUES (?, ?, 'contact_form', NOW())";
      $newsletter_stmt = mysqli_prepare($connection, $newsletter_query);
      if ($newsletter_stmt) {
        mysqli_stmt_bind_param($newsletter_stmt, 'ss', $email, $name);
        mysqli_stmt_execute($newsletter_stmt);
        mysqli_stmt_close($newsletter_stmt);
      }
    }

    // Send email notification to admin
    $admin_subject = "New Contact Form Submission - " . $subject;
    $admin_message = "
        <html>
        <head>
            <title>New Contact Message</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4B002E;'>New Contact Form Submission</h2>
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
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Service Type:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($service_type) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Subject:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($subject) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Message:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . nl2br(htmlspecialchars($message)) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Newsletter Opt-in:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . ($newsletter ? 'Yes' : 'No') . "</td>
                    </tr>
                </table>
                <p style='margin-top: 20px; font-size: 12px; color: #666;'>
                    Submitted on: " . date('Y-m-d H:i:s') . "<br>
                    IP Address: {$ip_address}
                </p>
            </div>
        </body>
        </html>";

    sendEmail(ADMIN_EMAIL, $admin_subject, $admin_message);

    // Send confirmation email to user
    $user_subject = "Thank you for contacting " . SITE_NAME;
    $user_message = "
        <html>
        <head>
            <title>Thank you for your message</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4B002E;'>Thank you for contacting us!</h2>
                <p>Dear " . htmlspecialchars($name) . ",</p>
                <p>We have received your message regarding <strong>" . htmlspecialchars($subject) . "</strong> and will get back to you within 24 hours.</p>
                <div style='background: #f9f9f9; padding: 15px; border-left: 4px solid #4B002E; margin: 20px 0;'>
                    <p><strong>Your message:</strong></p>
                    <p>" . nl2br(htmlspecialchars($message)) . "</p>
                </div>
                <p>If you have any urgent inquiries, please call us directly at +254 700 000 000.</p>
                <p>Best regards,<br>" . SITE_NAME . " Team</p>
            </div>
        </body>
        </html>";

    sendEmail($email, $user_subject, $user_message);

    // Log successful submission
    logActivity('Contact form submitted successfully', [
      'contact_id' => $contact_id,
      'name' => $name,
      'email' => $email,
      'service_type' => $service_type
    ]);

    mysqli_stmt_close($insert_stmt);
    mysqli_close($connection);

    sendJsonResponse(true, 'Thank you! Your message has been sent successfully. We will get back to you soon.');
  } else {
    logError('Failed to insert contact message', [
      'error' => mysqli_error($connection),
      'email' => $email
    ]);
    mysqli_stmt_close($insert_stmt);
    sendJsonResponse(false, 'Failed to send message. Please try again.');
  }
} catch (Exception $e) {
  logError('Exception in contact.php', [
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
