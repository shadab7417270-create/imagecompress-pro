// =====================================================
// ImageCompress Pro - V1
// ZIP completely removed
// Individual download only
// Original format preserved
// =====================================================


// =====================================================
// DOM Elements
// =====================================================

const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const dropZone = document.getElementById("dropZone");

const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");

const fileList = document.getElementById("fileList");
const emptyState = document.getElementById("emptyState");
const actions = document.getElementById("actions");

const clearBtn = document.getElementById("clearBtn");
const compressBtn = document.getElementById("compressBtn");

const summary = document.getElementById("summary");

const compressMoreBtn =
    document.getElementById("compressMoreBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const originalTotal =
    document.getElementById("originalTotal");

const compressedTotal =
    document.getElementById("compressedTotal");

const savedTotal =
    document.getElementById("savedTotal");

const reductionTotal =
    document.getElementById("reductionTotal");

const menuBtn =
    document.getElementById("menuBtn");

const navMenu =
    document.getElementById("navMenu");


// =====================================================
// Global Variables
// =====================================================

let files = [];
let results = [];


// =====================================================
// Helpers
// =====================================================

function formatBytes(bytes) {

    if (!bytes || bytes === 0) {
        return "0 B";
    }

    const units = [
        "B",
        "KB",
        "MB",
        "GB"
    ];

    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    const size =
        bytes / Math.pow(1024, index);

    return `${size.toFixed(
        index === 0 ? 0 : 2
    )} ${units[index]}`;
}


// =====================================================
// Get File Extension
// =====================================================

function getFileExtension(fileName) {

    const match =
        fileName.match(/\.([^.]+)$/);

    if (!match) {
        return "";
    }

    return match[1].toLowerCase();
}


// =====================================================
// Get Output Type
// =====================================================

function getOutputType(file) {

    const type =
        file.type.toLowerCase();

    if (type === "image/png") {
        return "image/png";
    }

    if (type === "image/webp") {
        return "image/webp";
    }

    if (type === "image/jpeg") {
        return "image/jpeg";
    }

    return null;
}


// =====================================================
// Get Output Extension
// =====================================================

function getOutputExtension(file) {

    const extension =
        getFileExtension(file.name);

    if (extension === "jpeg") {
        return "jpeg";
    }

    if (extension === "jpg") {
        return "jpg";
    }

    if (extension === "png") {
        return "png";
    }

    if (extension === "webp") {
        return "webp";
    }

    return "jpg";
}


// =====================================================
// Create Download Name
// =====================================================

function createDownloadName(file) {

    const originalName =
        file.name.replace(/\.[^.]+$/, "");

    const extension =
        getOutputExtension(file);

    return `${originalName}-compressed.${extension}`;
}


// =====================================================
// Render Selected Files
// =====================================================

function renderFiles() {

    fileList.innerHTML = "";

    if (files.length === 0) {

        emptyState.hidden = false;
        actions.hidden = true;
        summary.hidden = true;

        return;
    }

    emptyState.hidden = true;
    actions.hidden = false;

    files.forEach((file, index) => {

        const result =
            results[index];

        const item =
            document.createElement("div");

        item.className = "file-item";


        // -------------------------------------------------
        // Left Side
        // -------------------------------------------------

        const left =
            document.createElement("div");

        left.className = "file-info";


        // -------------------------------------------------
        // Icon
        // -------------------------------------------------

        const icon =
            document.createElement("div");

        icon.className = "file-icon";
        icon.textContent = "🖼️";


        // -------------------------------------------------
        // Details
        // -------------------------------------------------

        const details =
            document.createElement("div");

        details.className =
            "file-details";


        // File Name

        const name =
            document.createElement("strong");

        name.textContent =
            file.name;


        // File Size

        const size =
            document.createElement("span");

        if (result) {

            size.textContent =
                `${formatBytes(file.size)} → ${formatBytes(result.blob.size)}`;

        } else {

            size.textContent =
                formatBytes(file.size);
        }


        details.appendChild(name);
        details.appendChild(size);

        left.appendChild(icon);
        left.appendChild(details);

        item.appendChild(left);


        // -------------------------------------------------
        // Individual Download Button
        // -------------------------------------------------

        if (result) {

            const individualDownloadBtn =
                document.createElement("button");

            individualDownloadBtn.type =
                "button";

            individualDownloadBtn.className =
                "btn secondary";

            individualDownloadBtn.textContent =
                "Download";

            individualDownloadBtn.addEventListener(
                "click",
                () => {

                    downloadResult(index);

                }
            );

            item.appendChild(
                individualDownloadBtn
            );
        }


        fileList.appendChild(item);
    });
}


// =====================================================
// Add Files
// =====================================================

function addFiles(selectedFiles) {

    const incoming =
        Array.from(selectedFiles);


    // -------------------------------------------------
    // Validate Files
    // -------------------------------------------------

    const validFiles =
        incoming.filter(file => {

            const validType =
                file.type === "image/jpeg" ||
                file.type === "image/png" ||
                file.type === "image/webp";

            const validSize =
                file.size <=
                25 * 1024 * 1024;

            return validType && validSize;
        });


    // -------------------------------------------------
    // Invalid File Alert
    // -------------------------------------------------

    if (
        validFiles.length !==
        incoming.length
    ) {

        alert(
            "Only JPG, JPEG, PNG and WebP images up to 25 MB are allowed."
        );
    }


    // -------------------------------------------------
    // Add Valid Files
    // -------------------------------------------------

    files = [
        ...files,
        ...validFiles
    ];


    // -------------------------------------------------
    // Remove Duplicate Files
    // -------------------------------------------------

    const uniqueFiles = [];
    const seen = new Set();

    files.forEach(file => {

        const key =
            `${file.name}-${file.size}-${file.lastModified}`;

        if (!seen.has(key)) {

            seen.add(key);
            uniqueFiles.push(file);
        }
    });


    files = uniqueFiles;


    // -------------------------------------------------
    // New Files Require New Compression
    // -------------------------------------------------

    results = [];

    summary.hidden = true;

    renderFiles();
}


// =====================================================
// Browse Button
// =====================================================

if (browseBtn && fileInput) {

    browseBtn.addEventListener(
        "click",
        () => {

            fileInput.click();

        }
    );
}


// =====================================================
// File Input
// =====================================================

if (fileInput) {

    fileInput.addEventListener(
        "change",
        event => {

            addFiles(
                event.target.files
            );

            // Allow selecting same file again
            fileInput.value = "";

        }
    );
}


// =====================================================
// Drag & Drop
// =====================================================

if (dropZone) {

    // Drag Over

    dropZone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            dropZone.classList.add(
                "dragover"
            );

        }
    );


    // Drag Leave

    dropZone.addEventListener(
        "dragleave",
        () => {

            dropZone.classList.remove(
                "dragover"
            );

        }
    );


    // Drop

    dropZone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            dropZone.classList.remove(
                "dragover"
            );

            addFiles(
                event.dataTransfer.files
            );

        }
    );


    // Click Drop Zone

    dropZone.addEventListener(
        "click",
        event => {

            if (
                event.target.closest("button")
            ) {
                return;
            }

            if (fileInput) {
                fileInput.click();
            }

        }
    );


    // Keyboard Accessibility

    dropZone.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                if (fileInput) {
                    fileInput.click();
                }
            }

        }
    );
}


// =====================================================
// Quality Slider
// =====================================================

if (quality && qualityValue) {

    quality.addEventListener(
        "input",
        () => {

            qualityValue.textContent =
                `${quality.value}%`;


            document
                .querySelectorAll(
                    ".presets button"
                )
                .forEach(button => {

                    button.classList.remove(
                        "active"
                    );

                });

        }
    );
}


// =====================================================
// Quality Presets
// =====================================================

document
    .querySelectorAll(".presets button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.dataset.quality;


                if (quality) {

                    quality.value =
                        value;
                }


                if (qualityValue) {

                    qualityValue.textContent =
                        `${value}%`;
                }


                document
                    .querySelectorAll(
                        ".presets button"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );
            }
        );
    });


// =====================================================
// Compress Image
// =====================================================

function compressFile(
    file,
    qualityValueNumber
) {

    return new Promise(
        (resolve, reject) => {

            const image =
                new Image();

            const objectURL =
                URL.createObjectURL(file);


            // -------------------------------------------------
            // Image Loaded
            // -------------------------------------------------

            image.onload = () => {

                const maxDimension =
                    2400;


                const largestDimension =
                    Math.max(
                        image.naturalWidth,
                        image.naturalHeight
                    );


                const scale =
                    Math.min(
                        1,
                        maxDimension /
                            largestDimension
                    );


                const width =
                    Math.max(
                        1,
                        Math.round(
                            image.naturalWidth *
                                scale
                        )
                    );


                const height =
                    Math.max(
                        1,
                        Math.round(
                            image.naturalHeight *
                                scale
                        )
                    );


                // -------------------------------------------------
                // Canvas
                // -------------------------------------------------

                const canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.width =
                    width;

                canvas.height =
                    height;


                const context =
                    canvas.getContext(
                        "2d"
                    );


                if (!context) {

                    URL.revokeObjectURL(
                        objectURL
                    );

                    reject(
                        new Error(
                            "Canvas not supported"
                        )
                    );

                    return;
                }


                // -------------------------------------------------
                // White Background for JPG/JPEG
                // -------------------------------------------------

                if (
                    file.type ===
                    "image/jpeg"
                ) {

                    context.fillStyle =
                        "#ffffff";

                    context.fillRect(
                        0,
                        0,
                        width,
                        height
                    );
                }


                // -------------------------------------------------
                // Draw Image
                // -------------------------------------------------

                context.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );


                // -------------------------------------------------
                // Output Type
                // -------------------------------------------------

                const outputType =
                    getOutputType(file);


                if (!outputType) {

                    URL.revokeObjectURL(
                        objectURL
                    );

                    reject(
                        new Error(
                            "Unsupported image format"
                        )
                    );

                    return;
                }


                // -------------------------------------------------
                // Convert Canvas to Blob
                // -------------------------------------------------

                canvas.toBlob(
                    blob => {

                        URL.revokeObjectURL(
                            objectURL
                        );


                        if (!blob) {

                            reject(
                                new Error(
                                    "Compression failed"
                                )
                            );

                            return;
                        }


                        resolve({

                            blob: blob,

                            type: outputType

                        });

                    },

                    outputType,

                    qualityValueNumber / 100
                );
            };


            // -------------------------------------------------
            // Image Error
            // -------------------------------------------------

            image.onerror = () => {

                URL.revokeObjectURL(
                    objectURL
                );

                reject(
                    new Error(
                        "Invalid image"
                    )
                );
            };


            image.src =
                objectURL;
        }
    );
}


// =====================================================
// Compress Button
// =====================================================

if (compressBtn) {

    compressBtn.addEventListener(
        "click",
        async () => {

            if (files.length === 0) {

                alert(
                    "Please select at least one image."
                );

                return;
            }


            compressBtn.disabled =
                true;

            compressBtn.innerHTML =
                "Compressing...";


            results = [];


            try {

                // -------------------------------------------------
                // Compress Each Image
                // -------------------------------------------------

                for (
                    let i = 0;
                    i < files.length;
                    i++
                ) {

                    const result =
                        await compressFile(
                            files[i],
                            Number(
                                quality.value
                            )
                        );


                    results.push(
                        result
                    );


                    renderFiles();
                }


                // -------------------------------------------------
                // Calculate Summary
                // -------------------------------------------------

                calculateSummary();

                summary.hidden =
                    false;


                // -------------------------------------------------
                // Scroll to Summary
                // -------------------------------------------------

                summary.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });

            } catch (error) {

                console.error(
                    "Compression error:",
                    error
                );

                alert(
                    "Something went wrong while compressing the images."
                );

            } finally {

                compressBtn.disabled =
                    false;

                compressBtn.innerHTML =
                    'Compress Images <span>→</span>';
            }
        }
    );
}


// =====================================================
// Calculate Summary
// =====================================================

function calculateSummary() {

    // -------------------------------------------------
    // Original Total
    // -------------------------------------------------

    const original =
        files.reduce(
            (total, file) => {

                return total + file.size;

            },
            0
        );


    // -------------------------------------------------
    // Compressed Total
    // -------------------------------------------------

    const compressed =
        results.reduce(
            (total, result) => {

                return total +
                    result.blob.size;

            },
            0
        );


    // -------------------------------------------------
    // Saved
    // -------------------------------------------------

    const saved =
        Math.max(
            0,
            original - compressed
        );


    // -------------------------------------------------
    // Reduction Percentage
    // -------------------------------------------------

    const reduction =
        original > 0
            ? (saved / original) * 100
            : 0;


    // -------------------------------------------------
    // Update UI
    // -------------------------------------------------

    originalTotal.textContent =
        formatBytes(original);

    compressedTotal.textContent =
        formatBytes(compressed);

    savedTotal.textContent =
        formatBytes(saved);

    reductionTotal.textContent =
        `${reduction.toFixed(1)}%`;
}


// =====================================================
// Individual Download
// =====================================================

function downloadResult(index) {

    const result =
        results[index];

    const file =
        files[index];


    if (!result || !file) {
        return;
    }


    // -------------------------------------------------
    // Create Object URL
    // -------------------------------------------------

    const url =
        URL.createObjectURL(
            result.blob
        );


    // -------------------------------------------------
    // Create Download Link
    // -------------------------------------------------

    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        createDownloadName(file);


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    // -------------------------------------------------
    // Clean URL
    // -------------------------------------------------

    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );
}


// =====================================================
// Summary Download Button
// =====================================================
// Downloads all compressed images individually.
// ZIP is NOT used.
// =====================================================

if (downloadBtn) {

    downloadBtn.addEventListener(
        "click",
        async () => {

            if (results.length === 0) {

                alert(
                    "Please compress images first."
                );

                return;
            }


            // -------------------------------------------------
            // Disable Button
            // -------------------------------------------------

            downloadBtn.disabled =
                true;

            downloadBtn.textContent =
                "Downloading...";


            // -------------------------------------------------
            // Download Each Image
            // -------------------------------------------------

            for (
                let i = 0;
                i < results.length;
                i++
            ) {

                downloadResult(i);


                // Small delay between downloads
                // to help browser handle multiple downloads

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            300
                        )
                );
            }


            // -------------------------------------------------
            // Enable Button
            // -------------------------------------------------

            downloadBtn.disabled =
                false;

            downloadBtn.textContent =
                "Download";
        }
    );
}


// =====================================================
// Clear All
// =====================================================

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        () => {

            files = [];

            results = [];


            if (fileInput) {

                fileInput.value =
                    "";
            }


            summary.hidden =
                true;


            renderFiles();
        }
    );
}


// =====================================================
// Compress More
// =====================================================

if (compressMoreBtn) {

    compressMoreBtn.addEventListener(
        "click",
        () => {

            files = [];

            results = [];


            if (fileInput) {

                fileInput.value =
                    "";
            }


            summary.hidden =
                true;


            renderFiles();


            const compressor =
                document.getElementById(
                    "compressor"
                );


            if (compressor) {

                compressor.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    );
}


// =====================================================
// FAQ
// =====================================================

document
    .querySelectorAll(".faq-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const isOpen =
                    item.classList.contains(
                        "open"
                    );


                // Close all FAQ items

                document
                    .querySelectorAll(
                        ".faq-item"
                    )
                    .forEach(other => {

                        other.classList.remove(
                            "open"
                        );

                    });


                // Open clicked item

                if (!isOpen) {

                    item.classList.add(
                        "open"
                    );
                }
            }
        );
    });


// =====================================================
// Mobile Menu
// =====================================================

if (menuBtn && navMenu) {

    menuBtn.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle(
                "mobile-open"
            );
        }
    );


    navMenu
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navMenu.classList.remove(
                        "mobile-open"
                    );
                }
            );
        });
}


// =====================================================
// Initial State
// =====================================================

renderFiles();