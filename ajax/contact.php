<?php
require_once '../includes/config.php';

if (!isAjax()) {
  die('Direct access not allowed');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = sanitize($_POST['name'] ?? '');
  $email = sanitize($_POST['email'] ?? '');
  $phone = sanitize($_POST['phone'] ?? '');
  $subject = sanitize($_POST['subject'] ?? '');
  $message = sanitize($_POST['message'] ?? '');
  $service_type = sanitize($_POST['service_type'] ?? '');
  $newsletter = isset($_POST['newsletter']) ? 1 : 0;

  // Validation
  $errors = [];

  if (empty($name)) {
    $errors[] = 'Name is required.';
  }

  if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email is required.';
  }

  if (empty($subject)) {
    $errors[] = 'Subject is required.';
  }

  if (empty($message)) {
    $errors[] = 'Message is required.';
  }

  if (!empty($errors)) {
    jsonResponse(false, implode(' ', $errors));
  }

  try {
    // Insert contact message into database
    $stmt = $pdo->prepare("
            INSERT INTO contact_messages 
            (name, email, phone, subject, message, service_type, form_type, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");

    $stmt->execute([
      $name,
      $email,
      $phone,
      $subject,
      $message,
      $service_type,
      'contact'
    ]);

    // If newsletter subscription is requested, add to newsletter
    if ($newsletter) {
      try {
        $newsletterStmt = $pdo->prepare("
                INSERT INTO newsletter_subscribers (email, name, status, subscribed_at) 
                VALUES (?, ?, 'active', NOW())
                ON DUPLICATE KEY UPDATE name = VALUES(name), status = 'active'
            ");
        $newsletterStmt->execute([$email, $name]);
      } catch (PDOException $e) {
        // Newsletter subscription failed, but don't fail the main contact form
        error_log("Newsletter subscription error: " . $e->getMessage());
      }
    }

    // Send email to admin
    $adminSubject = "New Contact Message from " . SITE_NAME . " Website";
    $adminMessage = "
        <html>
        <head>
            <title>New Contact Message</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4B002E;'>New Contact Message</h2>
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
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Service Interest:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($service_type) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Subject:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($subject) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Newsletter:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . ($newsletter ? 'Yes' : 'No') . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Message:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . nl2br(htmlspecialchars($message)) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Phone:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($phone) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Company:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($company) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Subject:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($subject) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Message:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . nl2br(htmlspecialchars($message)) . "</td>
                    </tr>
                </table>
                <p style='margin-top: 20px; font-size: 12px; color: #666;'>
                    Submitted on: " . date('Y-m-d H:i:s') . "<br>
                    IP Address: " . $_SERVER['REMOTE_ADDR'] . "
                </p>
            </div>
        </body>
        </html>";

    sendEmail(ADMIN_EMAIL, $adminSubject, $adminMessage, $email);

    // Send confirmation email to user
    $userSubject = "Thank you for contacting " . SITE_NAME;
    $userMessage = "
        <html>
        <head>
            <title>Thank you for your message</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4B002E;'>Thank you for contacting us!</h2>
                <p>Dear " . htmlspecialchars($name) . ",</p>
                <p>We have received your message and will get back to you within 24 hours.</p>
                <div style='background: #f9f9f9; padding: 15px; border-left: 4px solid #4B002E; margin: 20px 0;'>
                    <p><strong>Your message:</strong></p>
                    <p>" . nl2br(htmlspecialchars($message)) . "</p>
                </div>
                <p>If you need immediate assistance, please call us at +254 700 000 000.</p>
                <p>Best regards,<br>" . SITE_NAME . " Team</p>
            </div>
        </body>
        </html>";

    sendEmail($email, $userSubject, $userMessage);

    jsonResponse(true, 'Thank you for your message! We will get back to you soon.');
  } catch (PDOException $e) {
    error_log("Contact form error: " . $e->getMessage());
    jsonResponse(false, 'An error occurred. Please try again later.');
  }
}

jsonResponse(false, 'Invalid request method.');
