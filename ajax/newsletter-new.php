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
  logError('Database connection failed in newsletter.php');
  sendJsonResponse(false, 'Database connection error. Please try again later.');
}

try {
  // Sanitize and validate input data
  $email = sanitizeInput($connection, $_POST['email'] ?? '');
  $name = sanitizeInput($connection, $_POST['name'] ?? '');
  $source = sanitizeInput($connection, $_POST['source'] ?? 'footer_form');

  // Validation
  if (empty($email)) {
    sendJsonResponse(false, 'Email address is required');
  }

  if (!isValidEmail($email)) {
    sendJsonResponse(false, 'Please enter a valid email address');
  }

  // Check if email already exists
  $check_query = "SELECT id, status FROM newsletter_subscribers WHERE email = ?";
  $check_stmt = mysqli_prepare($connection, $check_query);

  if (!$check_stmt) {
    logError('Failed to prepare email check query', ['error' => mysqli_error($connection)]);
    sendJsonResponse(false, 'Database error. Please try again.');
  }

  mysqli_stmt_bind_param($check_stmt, 's', $email);
  mysqli_stmt_execute($check_stmt);
  $check_result = mysqli_stmt_get_result($check_stmt);

  if (mysqli_num_rows($check_result) > 0) {
    $existing = mysqli_fetch_assoc($check_result);
    mysqli_stmt_close($check_stmt);

    if ($existing['status'] === 'active') {
      mysqli_close($connection);
      sendJsonResponse(false, 'This email is already subscribed to our newsletter');
    } else {
      // Reactivate subscription
      $update_query = "UPDATE newsletter_subscribers 
                            SET status = 'active', name = ?, source = ?, subscribed_at = NOW() 
                            WHERE email = ?";
      $update_stmt = mysqli_prepare($connection, $update_query);

      if (!$update_stmt) {
        logError('Failed to prepare update query', ['error' => mysqli_error($connection)]);
        sendJsonResponse(false, 'Database error. Please try again.');
      }

      mysqli_stmt_bind_param($update_stmt, 'sss', $name, $source, $email);

      if (mysqli_stmt_execute($update_stmt)) {
        mysqli_stmt_close($update_stmt);

        // Log successful reactivation
        logActivity('Newsletter subscription reactivated', [
          'email' => $email,
          'name' => $name,
          'source' => $source
        ]);

        // Send welcome back email
        sendWelcomeEmail($email, $name, true);

        mysqli_close($connection);
        sendJsonResponse(true, 'Welcome back! Your newsletter subscription has been reactivated.');
      } else {
        logError('Failed to reactivate newsletter subscription', ['error' => mysqli_error($connection), 'email' => $email]);
        mysqli_stmt_close($update_stmt);
        sendJsonResponse(false, 'Failed to reactivate subscription. Please try again.');
      }
    }
  } else {
    mysqli_stmt_close($check_stmt);

    // Insert new subscription
    $insert_query = "INSERT INTO newsletter_subscribers (email, name, source, status, ip_address, user_agent, subscribed_at) 
                        VALUES (?, ?, ?, 'active', ?, ?, NOW())";
    $insert_stmt = mysqli_prepare($connection, $insert_query);

    if (!$insert_stmt) {
      logError('Failed to prepare newsletter insert query', ['error' => mysqli_error($connection)]);
      sendJsonResponse(false, 'Database error. Please try again.');
    }

    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

    mysqli_stmt_bind_param($insert_stmt, 'sssss', $email, $name, $source, $ip_address, $user_agent);

    if (mysqli_stmt_execute($insert_stmt)) {
      $subscriber_id = mysqli_insert_id($connection);
      mysqli_stmt_close($insert_stmt);

      // Log successful subscription
      logActivity('New newsletter subscription', [
        'subscriber_id' => $subscriber_id,
        'email' => $email,
        'name' => $name,
        'source' => $source
      ]);

      // Send welcome email
      sendWelcomeEmail($email, $name, false);

      // Send notification to admin
      $admin_subject = "New Newsletter Subscription";
      $admin_message = "
            <h2>New Newsletter Subscription</h2>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Name:</strong> " . ($name ? htmlspecialchars($name) : 'Not provided') . "</p>
            <p><strong>Source:</strong> {$source}</p>
            <p><strong>Subscribed at:</strong> " . date('Y-m-d H:i:s') . "</p>
            <p><strong>IP Address:</strong> {$ip_address}</p>
            ";

      sendEmail(ADMIN_EMAIL, $admin_subject, $admin_message);

      mysqli_close($connection);
      sendJsonResponse(true, 'Thank you for subscribing! Please check your email for confirmation.');
    } else {
      logError('Failed to insert newsletter subscription', ['error' => mysqli_error($connection), 'email' => $email]);
      mysqli_stmt_close($insert_stmt);
      sendJsonResponse(false, 'Failed to subscribe. Please try again.');
    }
  }
} catch (Exception $e) {
  logError('Exception in newsletter.php', [
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

// Helper function to send welcome email
function sendWelcomeEmail($email, $name, $isReactivation = false)
{
  $subject = $isReactivation ? "Welcome back to " . SITE_NAME . " Newsletter!" : "Welcome to " . SITE_NAME . " Newsletter!";
  $greeting = $name ? "Dear " . htmlspecialchars($name) : "Hello";
  $welcome_text = $isReactivation ? "Welcome back! Your newsletter subscription has been reactivated." : "Thank you for subscribing to our newsletter!";

  $message = "
    <html>
    <head>
        <title>Newsletter Subscription Confirmation</title>
    </head>
    <body>
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background: #4B002E; color: white; padding: 20px; text-align: center;'>
                <h1 style='margin: 0;'>" . SITE_NAME . "</h1>
            </div>
            
            <div style='padding: 30px 20px;'>
                <h2 style='color: #4B002E;'>Newsletter Subscription Confirmed!</h2>
                <p>{$greeting},</p>
                <p>{$welcome_text}</p>
                
                <div style='background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 25px 0;'>
                    <h3 style='color: #4B002E; margin-top: 0;'>What to expect:</h3>
                    <ul style='margin: 10px 0;'>
                        <li>Monthly updates on our latest services and offerings</li>
                        <li>Industry insights and business tips</li>
                        <li>Special offers and early access to new services</li>
                        <li>Event invitations and networking opportunities</li>
                        <li>Wellness and productivity tips for professionals</li>
                    </ul>
                </div>
                
                <div style='background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 25px 0;'>
                    <h4 style='color: #2e7d32; margin-top: 0;'>Stay Connected</h4>
                    <p style='margin: 10px 0;'>Follow us on social media for daily updates and behind-the-scenes content:</p>
                    <p style='margin: 10px 0;'>
                        📧 Email: " . SITE_EMAIL . "<br>
                        📱 Phone: +254 700 000 000<br>
                        🌐 Website: " . SITE_URL . "
                    </p>
                </div>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
                
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='" . SITE_URL . "' style='background: #4B002E; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;'>Visit Our Website</a>
                </div>
                
                <p style='font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;'>
                    You received this email because you subscribed to our newsletter. 
                    If you wish to unsubscribe, please contact us at " . SITE_EMAIL . ".
                </p>
            </div>
        </div>
    </body>
    </html>";

  return sendEmail($email, $subject, $message);
}
