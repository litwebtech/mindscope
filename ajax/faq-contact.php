<?php
require_once '../includes/config.php';

// Check if request is AJAX
if (!isAjax()) {
  jsonResponse(false, 'Invalid request method');
}

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  jsonResponse(false, 'Invalid request method');
}

// Get and sanitize input data
$name = sanitize($_POST['name'] ?? '');
$email = sanitize($_POST['email'] ?? '');
$question = sanitize($_POST['question'] ?? '');

// Validation
$errors = [];

if (empty($name)) {
  $errors[] = 'Name is required';
}

if (empty($email)) {
  $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $errors[] = 'Invalid email format';
}

if (empty($question)) {
  $errors[] = 'Question is required';
}

if (!empty($errors)) {
  jsonResponse(false, 'Validation failed', ['errors' => $errors]);
}

try {
  // Insert into database
  $stmt = $pdo->prepare("
        INSERT INTO contact_messages (name, email, subject, message, form_type, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())
    ");

  $stmt->execute([
    $name,
    $email,
    'FAQ Question',
    $question,
    'faq'
  ]);

  // Send email notification to admin
  $adminSubject = "New FAQ Question from " . $name;
  $adminMessage = "
    <h2>New FAQ Question Received</h2>
    <p><strong>From:</strong> {$name}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Question:</strong></p>
    <p>{$question}</p>
    <br>
    <p><small>Submitted on: " . date('Y-m-d H:i:s') . "</small></p>
    ";

  sendEmail(SITE_EMAIL, $adminSubject, $adminMessage);

  // Send confirmation email to user
  $userSubject = "Thank you for your question - Mindscope Services";
  $userMessage = "
    <h2>Thank you for contacting us!</h2>
    <p>Dear {$name},</p>
    <p>We have received your question and will get back to you within 24 hours.</p>
    <p><strong>Your Question:</strong></p>
    <p>{$question}</p>
    <br>
    <p>Best regards,<br>
    The Mindscope Services Team</p>
    <hr>
    <p><small>This is an automated message. Please do not reply to this email.</small></p>
    ";

  sendEmail($email, $userSubject, $userMessage);

  jsonResponse(true, 'Thank you! Your question has been submitted successfully. We will get back to you within 24 hours.');
} catch (PDOException $e) {
  error_log("FAQ Contact Error: " . $e->getMessage());
  jsonResponse(false, 'Sorry, there was an error submitting your question. Please try again.');
}
