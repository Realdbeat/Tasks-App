<?php
header('Content-Type: application/json');
try {
    $stmt = ["t_number" => "50067", "message" => "You are a blessing to others"];
    http_response_code(200);
    echo json_encode($stmt);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch tasks: ' . $e->getMessage()]);
}
?>
