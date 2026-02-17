<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

// Get POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['title']) || !isset($data['url'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

try {
    $taskId = 'task_' . time() . '_' . rand(1000, 9999);
    $stmt = $pdo->prepare("INSERT INTO tasks (task_id, title, reward, url, action, target) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $taskId,
        htmlspecialchars($data['title']),
        (int)$data['reward'],
        $data['url'],
        htmlspecialchars($data['action']),
        (int)($data['target'] ?? 100)
    ]);

    echo json_encode([
        'success' => true, 
        'task' => [
            'id' => $taskId,
            'title' => $data['title'],
            'reward' => (int)$data['reward'],
            'url' => $data['url'],
            'action' => $data['action']
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save task: ' . $e->getMessage()]);
}
?>
