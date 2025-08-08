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
    logError('Database connection failed in faq-contact.php');
    sendJsonResponse(false, 'Database connection error. Please try again later.');
}

try {
    // Sanitize and validate input data
    $name = sanitizeInput($connection, $_POST['name'] ?? '');
    $email = sanitizeInput($connection, $_POST['email'] ?? '');
    $question = sanitizeInput($connection, $_POST['question'] ?? '');
    $category = sanitizeInput($connection, $_POST['category'] ?? 'general');
    
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
    
    if (empty($question)) {
        $errors[] = 'Question is required';
    }
    
    // If there are validation errors, return them
    if (!empty($errors)) {
        logError('FAQ contact form validation failed', ['errors' => $errors, 'email' => $email]);
        sendJsonResponse(false, implode(', ', $errors));
    }
    
    // Check for recent duplicate submissions (within last 5 minutes)
    $check_query = "SELECT id FROM faq_contacts 
                    WHERE email = ? AND question = ?
                    AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)";
    
    $check_stmt = mysqli_prepare($connection, $check_query);
    if (!$check_stmt) {
        logError('Failed to prepare duplicate check query', ['error' => mysqli_error($connection)]);
        sendJsonResponse(false, 'Database error. Please try again.');
    }
    
    mysqli_stmt_bind_param($check_stmt, 'ss', $email, $question);
    mysqli_stmt_execute($check_stmt);
    $check_result = mysqli_stmt_get_result($check_stmt);
    
    if (mysqli_num_rows($check_result) > 0) {
        mysqli_stmt_close($check_stmt);
        mysqli_close($connection);
        sendJsonResponse(false, 'You have already submitted this question recently. Please wait a few minutes before submitting again.');
    }
    
    mysqli_stmt_close($check_stmt);
    
    // Insert FAQ contact into database
    $insert_query = "INSERT INTO faq_contacts (name, email, question, category, ip_address, user_agent, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, NOW())";
    
    $insert_stmt = mysqli_prepare($connection, $insert_query);
    if (!$insert_stmt) {
        logError('Failed to prepare FAQ insert query', ['error' => mysqli_error($connection)]);
        sendJsonResponse(false, 'Database error. Please try again.');
    }
    
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    mysqli_stmt_bind_param($insert_stmt, 'ssssss', 
        $name, $email, $question, $category, $ip_address, $user_agent
    );
    
    if (mysqli_stmt_execute($insert_stmt)) {
        $faq_id = mysqli_insert_id($connection);
        
        // Send email notification to admin
        $admin_subject = "New FAQ Question - " . $category;
        $admin_message = "
        <html>
        <head>
            <title>New FAQ Question</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4B002E;'>New FAQ Question Submitted</h2>
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
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Category:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($category) . "</td>
                    </tr>
                    <tr>
                        <td style='padding: 10px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;'>Question:</td>
                        <td style='padding: 10px; border: 1px solid #ddd;'>" . nl2br(htmlspecialchars($question)) . "</td>
                    </tr>
                </table>
                <p style='margin-top: 20px; font-size: 12px; color: #666;'>
                    Submitted on: " . date('Y-m-d H:i:s') . "<br>
                    IP Address: {$ip_address}<br>
                    FAQ ID: {$faq_id}
                </p>
                <div style='margin-top: 20px; padding: 15px; background: #f0f8ff; border-left: 4px solid #4B002E;'>
                    <p><strong>Action Required:</strong> Please respond to this question within 24 hours.</p>
                    <p>Reply directly to {$email} or log into the admin panel to manage this FAQ.</p>
                </div>
            </div>
        </body>
        </html>";
        
        sendEmail(ADMIN_EMAIL, $admin_subject, $admin_message);
        
        // Send confirmation email to user
        $user_subject = "FAQ Question Received - " . SITE_NAME;
        $user_message = "
        <html>
        <head>
            <title>FAQ Question Received</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4B002E;'>Thank you for your question!</h2>
                <p>Dear " . htmlspecialchars($name) . ",</p>
                <p>We have received your question and our team will get back to you with a detailed response within 24 hours.</p>
                
                <div style='background: #f9f9f9; padding: 15px; border-left: 4px solid #4B002E; margin: 20px 0;'>
                    <p><strong>Your question:</strong></p>
                    <p>" . nl2br(htmlspecialchars($question)) . "</p>
                </div>
                
                <div style='background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                    <h4 style='color: #2e7d32; margin-top: 0;'>📚 In the meantime...</h4>
                    <p style='margin: 10px 0;'>You might find answers to common questions in our FAQ section or by exploring our services:</p>
                    <ul style='margin: 10px 0;'>
                        <li><a href='" . SITE_URL . "/services/catering.html' style='color: #4B002E;'>Catering Services</a></li>
                        <li><a href='" . SITE_URL . "/services/events.html' style='color: #4B002E;'>Event Management</a></li>
                        <li><a href='" . SITE_URL . "/services/logistics.html' style='color: #4B002E;'>Logistics Solutions</a></li>
                        <li><a href='" . SITE_URL . "/services/consulting.html' style='color: #4B002E;'Strategic Business Support & Consulting/a></li>
                        <li><a href='" . SITE_URL . "/services/wellness.html' style='color: #4B002E;'>Wellness Programs</a></li>
                    </ul>
                </div>
                
                <p>If you have any urgent questions, please contact us directly:</p>
                <ul>
                    <li>Phone: +254 700 000 000</li>
                    <li>Email: " . SITE_EMAIL . "</li>
                </ul>
                
                <p>Best regards,<br>" . SITE_NAME . " Support Team</p>
                
                <p style='font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;'>
                    Reference ID: FAQ-{$faq_id}<br>
                    This is an automated response. We will reply personally within 24 hours.
                </p>
            </div>
        </body>
        </html>";
        
        sendEmail($email, $user_subject, $user_message);
        
        // Log successful submission
        logActivity('FAQ question submitted successfully', [
            'faq_id' => $faq_id,
            'name' => $name,
            'email' => $email,
            'category' => $category
        ]);
        
        mysqli_stmt_close($insert_stmt);
        mysqli_close($connection);
        
        sendJsonResponse(true, 'Thank you for your question! We will get back to you within 24 hours with a detailed response.');
        
    } else {
        logError('Failed to insert FAQ question', [
            'error' => mysqli_error($connection),
            'email' => $email
        ]);
        mysqli_stmt_close($insert_stmt);
        sendJsonResponse(false, 'Failed to submit question. Please try again.');
    }
    
} catch (Exception $e) {
    logError('Exception in faq-contact.php', [
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
?>
