<?php
// DB config for Xavigate debug dashboard
$host = 'localhost';
$db   = 'xavigate';
$user = 'xavigate_user';
$pass = 'changeme';
$port = '5432';

$dsn = "pgsql:host=$host;port=$port;dbname=$db;";
try {
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    die("DB connection failed: " . $e->getMessage());
}
