const translations = {
    id: {
        heading: "Unggah Gambar untuk Mengonversi ke PDF",
        fileInputLabel: "Pilih Gambar",
        noFilesSelected: "Belum ada file yang terpilih",
        oneFileSelected: "1 File telah dipilih",
        multipleFilesSelected: " File telah dipilih",
        uploadBtn: "Unggah Gambar",
        modalHeading: "Pratinjau PDF",
        renameLabel: "Nama file PDF yang diinginkan:",
        downloadBtn: "Unduh PDF",
        alertEnterFileName: "Silakan masukkan nama file.",
        alertUploadError: "Terjadi kesalahan saat mengunggah file."
    },
    en: {
        heading: "Upload Images to Convert to PDF",
        fileInputLabel: "Select Images",
        noFilesSelected: "No files selected",
        oneFileSelected: "1 File selected",
        multipleFilesSelected: " Files selected",
        uploadBtn: "Upload Images",
        modalHeading: "PDF Preview",
        renameLabel: "Rename PDF before download:",
        downloadBtn: "Download PDF",
        alertEnterFileName: "Please enter a file name.",
        alertUploadError: "Error uploading files."
    }
};

let currentLang = 'id'

const uploadForm = document.getElementById('uploadForm');
const previewModal = document.getElementById('previewModal');
const closeModal = document.getElementById('closeModal');
const pdfPreview = document.getElementById('pdfPreview');
const pdfNameInput = document.getElementById('pdfName');
const downloadBtn = document.getElementById('downloadBtn');
const fileInput = document.getElementById('fileInput');
const fileCount = document.getElementById('fileCount');
const uploadBtn = document.getElementById('uploadBtn');
const loadingScreen = document.getElementById('loadingScreen');
const langDropdownBtn = document.getElementById('langDropdownBtn');
const langDropdownMenu = document.querySelector('.lang-dropdown-menu');
const langDropdownItems = document.querySelectorAll('.lang-dropdown-item');
const heading = document.getElementById('heading');
const fileInputLabel = document.getElementById('fileInputLabel');
const modalHeading = document.getElementById('modalHeading');
const renameLabel = document.getElementById('renameLabel');

function updateTexts() {
    heading.textContent = translations[currentLang].heading;
    fileInputLabel.textContent = translations[currentLang].fileInputLabel;
    uploadBtn.value = translations[currentLang].uploadBtn;
    modalHeading.textContent = translations[currentLang].modalHeading;
    renameLabel.textContent = translations[currentLang].renameLabel;
    downloadBtn.textContent = translations[currentLang].downloadBtn;

    // Update file count text based on current file input state
    const count = fileInput.files.length;
    if (count === 0) {
        fileCount.textContent = translations[currentLang].noFilesSelected;
    } else if (count === 1) {
        fileCount.textContent = translations[currentLang].oneFileSelected;
    } else {
        fileCount.textContent = count + translations[currentLang].multipleFilesSelected;
    }

    // Update dropdown button label and flag
    langDropdownItems.forEach(item => {
        const lang = item.getAttribute('data-lang');
        if (lang === currentLang) {
            item.setAttribute('aria-selected', 'true');
            item.tabIndex = 0;
            langDropdownBtn.querySelector('.lang-label').textContent = item.textContent.trim();
            const flagClass = lang === 'en' ? 'flag-us' : 'flag-id';
            langDropdownBtn.querySelector('.flag-icon').className = 'flag-icon ' + flagClass;
        } else {
            item.setAttribute('aria-selected', 'false');
            item.tabIndex = -1;
        }
    });

    const fileUploadContainer = document.querySelector('.container');
    if (currentLang === 'id') {
        fileUploadContainer.classList.add('wider-box');
    } else {
        fileUploadContainer.classList.remove('wider-box');
    }
}

uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    loadingScreen.style.display = 'flex';

    const formData = new FormData(uploadForm);

    fetch('../api/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        loadingScreen.style.display = 'none';

        if (data.error) {
            alert(data.error);
            return;
        }
        // Show preview modal
        previewModal.style.display = 'flex';
        // Set PDF preview src
        pdfPreview.src = data.pdfUrl;
        // Set default PDF name
        pdfNameInput.value = 'converted.pdf';
    })
    .catch(error => {
        loadingScreen.style.display = 'none';

        alert(translations[currentLang].alertUploadError);
        console.error(error);
    });
});

closeModal.addEventListener('click', function() {
    previewModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target == previewModal) {
        previewModal.style.display = 'none';
    }
});

downloadBtn.addEventListener('click', function() {
    let fileName = pdfNameInput.value.trim();
    if (!fileName) {
        alert(translations[currentLang].alertEnterFileName);
        return;
    }
    if (!fileName.toLowerCase().endsWith('.pdf')) {
        fileName += '.pdf';
    }

    // Extract filename from pdfPreview.src URL
    const urlParams = new URLSearchParams(new URL(pdfPreview.src).search);
    const pdfFile = urlParams.get('file');

    // Trigger download with user-specified filename as 'name' parameter
    const url = new URL(pdfPreview.src);
    url.searchParams.set('name', fileName);

    const link = document.createElement('a');
    link.href = url.toString();
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Send request to delete the PDF file
    if (pdfFile) {
        fetch('../api/delete_pdf.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ file: pdfFile })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error('Failed to delete PDF:', data.error);
            }
        })
        .catch(error => {
            console.error('Error deleting PDF:', error);
        });
    }
});

// Update file count display and toggle visibility of upload button and file input
fileInput.addEventListener('change', function() {
    const count = fileInput.files.length;
    if (count === 0) {
        fileCount.textContent = translations[currentLang].noFilesSelected;
        uploadBtn.style.display = 'none';
        fileInput.style.display = 'inline-block';
        fileInputLabel.style.display = 'inline-block';
    } else {
        fileCount.textContent = count === 1 ? translations[currentLang].oneFileSelected : count + translations[currentLang].multipleFilesSelected;
        uploadBtn.style.display = 'inline-block';
        fileInput.style.display = 'none';
        fileInputLabel.style.display = 'none';
    }
});

// Initially hide the upload button since no files are selected
uploadBtn.style.display = 'none';

langDropdownBtn.addEventListener('click', function() {
    const expanded = langDropdownBtn.getAttribute('aria-expanded') === 'true';
    if (expanded) {
        langDropdownMenu.hidden = true;
        langDropdownBtn.setAttribute('aria-expanded', 'false');
    } else {
        langDropdownMenu.hidden = false;
        langDropdownBtn.setAttribute('aria-expanded', 'true');
        langDropdownMenu.focus();
    }
});

langDropdownItems.forEach(item => {
    item.addEventListener('click', function() {
        const selectedLang = this.getAttribute('data-lang');
        if (selectedLang !== currentLang) {
            currentLang = selectedLang;
            updateTexts();
        }
        langDropdownMenu.hidden = true;
        langDropdownBtn.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('click', function(event) {
    if (!event.target.closest('.lang-dropdown')) {
        langDropdownMenu.hidden = true;
        langDropdownBtn.setAttribute('aria-expanded', 'false');
    }
});

// Initialize texts on page load
updateTexts();
