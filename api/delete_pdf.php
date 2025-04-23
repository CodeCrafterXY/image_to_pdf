<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing file parameter']);
    exit;
}

$filename = basename($data['file']);
$filepath = __DIR__ . '/cached_uploads/' . $filename;

if (!file_exists($filepath)) {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit;
}

if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    // Windows: use timeout and del in a separate process
    pclose(popen("start /B cmd /C \"timeout /T 3600 && del /F /Q " . escapeshellarg($filepath) . "\"", "r"));
} else {
    // Unix-like: use at or sleep and rm in background
    exec("bash -c 'sleep 3600 && rm -f " . escapeshellarg($filepath) . "' > /dev/null 2>&1 &");
}

echo json_encode(['success' => true]);
?>
