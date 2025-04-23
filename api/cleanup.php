<?php
$dir = __DIR__ . '/cached_uploads/';
$files = glob($dir . '*');

$now = time();
$deletedFiles = [];

$threshold = 3600; // 1 hour in seconds

foreach ($files as $file) {
    if (is_file($file)) {
        $fileModTime = filemtime($file);
        if ($fileModTime !== false && ($now - $fileModTime) > $threshold) {
            if (unlink($file)) {
                $deletedFiles[] = basename($file);
            }
        }
    }
}

header('Content-Type: application/json');
echo json_encode([
    'deletedFiles' => $deletedFiles,
    'message' => count($deletedFiles) . ' files deleted.'
]);
?>
