<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Image to PDF Converter</title>
    <link rel="shortcut icon" href="./assets/icon.ico" type="image/x-icon">
    <link rel="stylesheet" href="styles.css" />
</head>
<body>
    <div class="lang-dropdown">
        <button class="lang-dropdown-btn" id="langDropdownBtn" aria-haspopup="listbox" aria-expanded="false">
            <span class="flag-icon flag-us"></span>
            <span class="lang-label">Bahasa Indonesia</span>
            <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5H7z" fill="currentColor"/>
            </svg>
        </button>
        <ul class="lang-dropdown-menu" role="listbox" tabindex="-1" aria-labelledby="langDropdownBtn" hidden>
            <li class="lang-dropdown-item" role="option" data-lang="id" aria-selected="false" tabindex="-1">
                <span class="flag-icon flag-id"></span> Bahasa Indonesia
            </li>
            <li class="lang-dropdown-item" role="option" data-lang="en" aria-selected="true" tabindex="0">
                <span class="flag-icon flag-us"></span> English
            </li>
        </ul>
    </div>
    <div class="container">
        <h1 id="heading">Upload Images to Convert to PDF</h1>
        <form id="uploadForm" action="../api/upload.php" method="POST" enctype="multipart/form-data">
            <div class="file-upload-container">
                <input type="file" id="fileInput" name="images[]" multiple required accept=".png, .jpg" />
                <label for="fileInput" class="custom-file-upload" id="fileInputLabel">Select Images</label>
                <span id="fileCount">No files selected</span>
            </div>
            <input type="submit" id="uploadBtn" value="Upload Images" />
        </form>
        <div id="loadingScreen" class="loading-screen" style="display:none;">
            <div class="spinner"></div>
        </div>
        <div id="previewModal" class="modal" style="display:none;">
            <div class="modal-content">
                <span id="closeModal" class="close">&times;</span>
                <h2 id="modalHeading">PDF Preview</h2>
                <div class="modal-body">
                    <embed id="pdfPreview" src="" type="application/pdf" />
                    <div class="rename-container">
                        <label for="pdfName" id="renameLabel">Rename PDF before download:</label>
                        <input type="text" id="pdfName" placeholder="Enter new PDF name" />
                        <button id="downloadBtn">Download PDF</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
