<?php
require_once '../includes/config.php';

if (!isAjax()) {
  die('Direct access not allowed');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = sanitize($_POST['name'] ?? '');
  $email = sanitize($_POST['email'] ?? '');
  $phone = sanitize($_POST['phone'] ?? '');
  $company = sanitize($_POST['company'] ?? '');
  $event_type = sanitize($_POST['event_type'] ?? '');
  $event_date = sanitize($_POST['event_date'] ?? '');
  $guests = sanitize($_POST['guests'] ?? '');
  $budget = sanitize($_POST['budget'] ?? '');
  $location = sanitize($_POST['location'] ?? '');
  $special_requirements = sanitize($_POST['special_requirements'] ?? '');

  // Validation
  $errors = [];

  if (empty($name)) {
    $errors[] = 'Name is required.';
  }

  if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email is required.';
  }

  if (empty($event_type)) {
    $errors[] = 'Event type is required.';
  }

  if (empty($event_date)) {
    $errors[] = 'Event date is required.';
  }

  if (empty($guests)) {
    $errors[] = 'Number of guests is required.';
  }

  if (!empty($errors)) {
    jsonResponse(false, implode(' ', $errors));
  }

  try {
    // Insert quote request into database
    $stmt = $pdo->prepare("
            INSERT INTO quote_requests 
            (name, email, phone, company, event_type, event_date, guests, budget, location, special_requirements, submitted_at, ip_address) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
        ");

    $stmt->execute([
      $name,
      $email,
      $phone,
      $company,
      $event_type,
      $event_date,
      $guests,
      $budget,
      $location,
      $special_requirements,
      $_SERVER['REMOTE_ADDR']
    ]);

    // Send email to admin
    $adminSubject = "New Catering Quote Request from " . SITE_NAME . " Website";
    $adminMessage = "
        <html>
        <head>
            <title>New Quote Request</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4B002E;'>New Catering Quote Request</h2>
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
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Company:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($company) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Event Type:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($event_type) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Event Date:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($event_date) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Number of Guests:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($guests) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Budget:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($budget) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Location:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($location) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Special Requirements:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . nl2br(htmlspecialchars($special_requirements)) . "</td>
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
    $userSubject = "Your Catering Quote Request - " . SITE_NAME;
    $userMessage = "
        <html>
        <head>
            <title>Quote Request Received</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4B002E;'>Thank you for your quote request!</h2>
                <p>Dear " . htmlspecialchars($name) . ",</p>
                <p>We have received your catering quote request and our team is reviewing the details. We will prepare a customized quote and get back to you within 24 hours.</p>
                <div style='background: #f9f9f9; padding: 15px; border-left: 4px solid #4B002E; margin: 20px 0;'>
                    <p><strong>Your Request Summary:</strong></p>
                    <p><strong>Event Type:</strong> " . htmlspecialchars($event_type) . "<br>
                    <strong>Date:</strong> " . htmlspecialchars($event_date) . "<br>
                    <strong>Guests:</strong> " . htmlspecialchars($guests) . "<br>
                    <strong>Location:</strong> " . htmlspecialchars($location) . "</p>
                </div>
                <p>If you need immediate assistance or have additional questions, please call us at +254 700 000 000.</p>
                <p>Best regards,<br>" . SITE_NAME . " Catering Team</p>
            </div>
        </body>
        </html>";

    sendEmail($email, $userSubject, $userMessage);

    jsonResponse(true, 'Thank you for your quote request! We will send you a detailed quote within 24 hours.');
  } catch (PDOException $e) {
    error_log("Quote request error: " . $e->getMessage());
    jsonResponse(false, 'An error occurred. Please try again later.');
  }
}

jsonResponse(false, 'Invalid request method.');
