<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'mindscope_db');

// Site configuration
define('SITE_URL', 'http://localhost/mindscope');
define('SITE_NAME', 'Mindscope Services Ltd');
define('SITE_EMAIL', 'info@mindscopeservices.com');
define('ADMIN_EMAIL', 'admin@mindscopeservices.com');

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

// Database connection
try {
  $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
  die("Database connection failed: " . $e->getMessage());
}

// Helper functions
function sanitize($data)
{
  return htmlspecialchars(strip_tags(trim($data)));
}

function isAjax()
{
  return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function jsonResponse($success, $message, $data = null)
{
  header('Content-Type: application/json');
  echo json_encode([
    'success' => $success,
    'message' => $message,
    'data' => $data
  ]);
  exit;
}

function sendEmail($to, $subject, $message, $from = SITE_EMAIL)
{
  $headers = "MIME-Version: 1.0" . "\r\n";
  $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
  $headers .= "From: " . SITE_NAME . " <" . $from . ">" . "\r\n";
  $headers .= "Reply-To: " . $from . "\r\n";
  $headers .= "X-Mailer: PHP/" . phpversion();

  return mail($to, $subject, $message, $headers);
}
