<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {
        $uploadsDir = 'cached_uploads/';
        if (!is_dir($uploadsDir)) {
            mkdir($uploadsDir, 0777, true);
        }

        $imagePaths = [];
        foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
            $fileName = basename($_FILES['images']['name'][$key]);
            $filePath = $uploadsDir . $fileName;
            if (move_uploaded_file($tmpName, $filePath)) {
                // Store absolute path for Imagick usage
                $imagePaths[] = __DIR__ . '/' . $filePath;
            } else {
                error_log("Failed to move uploaded file: " . $fileName);
                echo json_encode(['error' => 'Error uploading one or more files. Check the server logs.']);
                exit;
            }
        }

        // Sort images by filename
        sort($imagePaths);

        // Create PDF with unique filename
        $uniquePdfName = 'preview_' . time() . '.pdf';
        $pdfPath = createPDF($imagePaths, $uniquePdfName);

        // Return JSON response with PDF URL pointing directly to cached_uploads directory
        $pdfUrl = dirname($_SERVER['REQUEST_URI']) . '/cached_uploads/' . urlencode($uniquePdfName);
        header('Content-Type: application/json');
        echo json_encode(['pdfUrl' => $pdfUrl]);

        // Clean up uploaded images
        array_map('unlink', $imagePaths);
        exit;
    } else {
        echo json_encode(['error' => 'No files uploaded.']);
    }
}

function createPDF(array $imagePaths, string $pdfFileName = 'output.pdf'): string {
    $pdf = new Imagick();
    $canvasWidth = 2480;
    $canvasHeight = 3508;
    foreach ($imagePaths as $imagePath) {
        try {
            $img = new Imagick($imagePath);

            // Resize image to exact 2480 x 3508 px (stretch)
            $img->resizeImage($canvasWidth, $canvasHeight, Imagick::FILTER_LANCZOS, 0.5, false);

            // Add the stretched image directly to the PDF
            $pdf->addImage($img);

            $img->clear();
            unset($img);
        } catch (ImagickException $e) {
            error_log("Imagick Error for " . $imagePath . ": " . $e->getMessage());
            echo "Error processing image: " . basename($imagePath) . ". Check server logs for details.\n";
        }
    }
    $pdf->setImageFormat('pdf');
    $pdfPath = __DIR__ . '/cached_uploads/' . $pdfFileName;
    $pdf->writeImages($pdfPath, true);
    $pdf->clear();
    unset($pdf);
    return $pdfPath;
}
?>
