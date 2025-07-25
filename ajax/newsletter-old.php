<?php
require_once '../includes/config.php';

if (!isAjax()) {
  die('Direct access not allowed');
}

if ($_POST['action'] === 'subscribe') {
  $email = sanitize($_POST['email']);

  // Validate email
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Please enter a valid email address.');
  }

  try {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
      jsonResponse(false, 'You are already subscribed to our newsletter.');
    }

    // Insert new subscriber
    $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email, subscribed_at, ip_address) VALUES (?, NOW(), ?)");
    $stmt->execute([$email, $_SERVER['REMOTE_ADDR']]);

    // Send welcome email
    $subject = "Welcome to " . SITE_NAME . " Newsletter";
    $message = "
        <html>
        <head>
            <title>Welcome to our Newsletter</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4B002E;'>Welcome to " . SITE_NAME . "!</h2>
                <p>Thank you for subscribing to our newsletter. You'll receive updates about:</p>
                <ul>
                    <li>Latest news and insights</li>
                    <li>Special offers and promotions</li>
                    <li>New services and updates</li>
                    <li>Industry tips and best practices</li>
                </ul>
                <p>If you have any questions, feel free to contact us at " . SITE_EMAIL . "</p>
                <hr>
                <p style='font-size: 12px; color: #666;'>
                    You can unsubscribe at any time by clicking the unsubscribe link in our emails.
                </p>
            </div>
        </body>
        </html>";

    sendEmail($email, $subject, $message);

    jsonResponse(true, 'Thank you for subscribing! Check your email for confirmation.');
  } catch (PDOException $e) {
    error_log("Newsletter subscription error: " . $e->getMessage());
    jsonResponse(false, 'An error occurred. Please try again later.');
  }
}

jsonResponse(false, 'Invalid request.');
