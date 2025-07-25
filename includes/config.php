<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'mindscope_db');

// Site configuration
define('SITE_URL', 'http://localhost/mindscope');
define('SITE_NAME', 'Mindscope Services Ltd');
define('SITE_EMAIL', 'info@mindscopeservices.com');
define('ADMIN_EMAIL', 'admin@mindscopeservices.com');

// Error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 for production
ini_set('log_errors', 1);

// Start session
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

// Create MySQLi connection using procedural method
function getConnection()
{
  $connection = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

  if (!$connection) {
    error_log("Database connection failed: " . mysqli_connect_error());
    return false;
  }

  // Set charset to UTF8
  if (!mysqli_set_charset($connection, "utf8mb4")) {
    error_log("Error setting charset: " . mysqli_error($connection));
    mysqli_close($connection);
    return false;
  }

  return $connection;
}

// Helper function to sanitize input
function sanitizeInput($connection, $input)
{
  if ($input === null) {
    return null;
  }
  return mysqli_real_escape_string($connection, trim($input));
}

// Legacy sanitize function for compatibility
function sanitize($data)
{
  return htmlspecialchars(strip_tags(trim($data)));
}

// Helper function to validate email
function isValidEmail($email)
{
  return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Helper function to validate phone
function isValidPhone($phone)
{
  // Allow various phone formats including Kenyan numbers
  $pattern = '/^[\+]?[0-9\s\-\(\)]{10,}$/';
  return preg_match($pattern, $phone);
}

// Check if request is AJAX
function isAjax()
{
  return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

// Helper function to send JSON response
function sendJsonResponse($success, $message, $data = [])
{
  header('Content-Type: application/json');
  echo json_encode([
    'success' => $success,
    'message' => $message,
    'data' => $data,
    'timestamp' => date('Y-m-d H:i:s')
  ]);
  exit();
}

// Legacy jsonResponse function for compatibility
function jsonResponse($success, $message, $data = null)
{
  sendJsonResponse($success, $message, $data);
}

// Error logging function
function logError($message, $context = [])
{
  $logMessage = date('Y-m-d H:i:s') . " - " . $message;
  if (!empty($context)) {
    $logMessage .= " - Context: " . json_encode($context);
  }
  error_log($logMessage . PHP_EOL, 3, __DIR__ . '/../logs/error.log');
}

// Success logging function
function logActivity($message, $context = [])
{
  $logMessage = date('Y-m-d H:i:s') . " - " . $message;
  if (!empty($context)) {
    $logMessage .= " - Context: " . json_encode($context);
  }
  error_log($logMessage . PHP_EOL, 3, __DIR__ . '/../logs/activity.log');
}

// Function to create logs directory if it doesn't exist
function createLogsDirectory()
{
  $logsDir = __DIR__ . '/../logs';
  if (!file_exists($logsDir)) {
    mkdir($logsDir, 0755, true);
  }
}

// Initialize logs directory
createLogsDirectory();

// Email function
function sendEmail($to, $subject, $message, $from = SITE_EMAIL)
{
  $headers = "MIME-Version: 1.0" . "\r\n";
  $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
  $headers .= "From: " . SITE_NAME . " <" . $from . ">" . "\r\n";
  $headers .= "Reply-To: " . $from . "\r\n";
  $headers .= "X-Mailer: PHP/" . phpversion();

  return mail($to, $subject, $message, $headers);
}

// Application settings
define('APP_VERSION', '1.0.0');

// Timezone
date_default_timezone_set('Africa/Nairobi');

// Security settings
define('CSRF_TOKEN_EXPIRE', 3600); // 1 hour
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_LOCKOUT_TIME', 900); // 15 minutes

// Test database connection on include (optional)
// $test_connection = getConnection();
// if ($test_connection) {
//     mysqli_close($test_connection);
// }
