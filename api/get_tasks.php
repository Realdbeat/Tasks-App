<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query("SELECT task_id as id, title, reward, url, action FROM tasks ORDER BY created_at DESC");
    $tasks = $stmt->fetchAll();
    echo json_encode($tasks);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch tasks: ' . $e->getMessage()]);
}
?>
