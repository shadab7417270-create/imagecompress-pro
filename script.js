// =====================================================
// ImageCompress Pro - V1
// ZIP completely removed
// Individual download only
// Original format preserved
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
const compressMoreBtn = document.getElementById("compressMoreBtn");

const originalTotal = document.getElementById("originalTotal");
const compressedTotal = document.getElementById("compressedTotal");
const savedTotal = document.getElementById("savedTotal");
const reductionTotal = document.getElementById("reductionTotal");

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

let files = [];
let results = [];


// =====================================================
// Helpers
// =====================================================

function formatBytes(bytes) {
    if (!bytes || bytes === 0) {
        return "0 B";
    }

    const units = ["B", "KB", "MB", "GB"];
    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}


function getFileExtension(fileName) {
    const match = fileName.match(/\.([^.]+)$/);

    if (!match) {
        return "";
    }

    return match[1].toLowerCase();
}


function getOutputType(file) {
    const type = file.type.toLowerCase();

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


function getOutputExtension(file) {
    const extension = getFileExtension(file.name);

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


function createDownloadName(file) {
    const originalName = file.name.replace(/\.[^.]+$/, "");
    const extension = getOutputExtension(file);

    return `${originalName}-compressed.${extension}`;
}


// =====================================================
// Render selected files
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
        const result = results[index];

        const item = document.createElement("div");
        item.className = "file-item";

        const left = document.createElement("div");
        left.className = "file-info";

        const icon = document.createElement("div");
        icon.className = "file-icon";
        icon.textContent = "🖼️";

        const details = document.createElement("div");
        details.className = "file-details";

        const name = document.createElement("strong");
        name.textContent = file.name;

        const size = document.createElement("span");

        if (result) {
            size.textContent =
                `${formatBytes(file.size)} → ${formatBytes(result.blob.size)}`;
        } else {
            size.textContent = formatBytes(file.size);
        }

        details.appendChild(name);
        details.appendChild(size);

        left.appendChild(icon);
        left.appendChild(details);

        item.appendChild(left);

        // Download button only after compression
        if (result) {
            const downloadBtn = document.createElement("button");

            downloadBtn.type = "button";
            downloadBtn.className = "btn secondary";
            downloadBtn.textContent = "Download";

            downloadBtn.addEventListener("click", () => {
                downloadResult(index);
            });

            item.appendChild(downloadBtn);
        }

        fileList.appendChild(item);
    });
}


// =====================================================
// Add files
// =====================================================

function addFiles(selectedFiles) {
    const incoming = Array.from(selectedFiles);

    const validFiles = incoming.filter(file => {
        const validType =
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/webp";

        const validSize =
            file.size <= 25 * 1024 * 1024;

        return validType && validSize;
    });

    if (validFiles.length !== incoming.length) {
        alert(
            "Only JPG, JPEG, PNG and WebP images up to 25 MB are allowed."
        );
    }

    files = [...files, ...validFiles];

    // Remove duplicate files
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

    // New files require new compression
    results = [];

    summary.hidden = true;

    renderFiles();
}


// =====================================================
// Browse button
// =====================================================

if (browseBtn && fileInput) {
    browseBtn.addEventListener("click", () => {
        fileInput.click();
    });
}


// =====================================================
// File input
// =====================================================

if (fileInput) {
    fileInput.addEventListener("change", event => {
        addFiles(event.target.files);

        // Allow selecting the same file again
        fileInput.value = "";
    });
}


// =====================================================
// Drag & Drop
// =====================================================

if (dropZone) {

    dropZone.addEventListener("dragover", event => {
        event.preventDefault();

        dropZone.classList.add("dragover");
    });


    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });


    dropZone.addEventListener("drop", event => {
        event.preventDefault();

        dropZone.classList.remove("dragover");

        addFiles(event.dataTransfer.files);
    });


    dropZone.addEventListener("click", event => {
        if (event.target.closest("button")) {
            return;
        }

        if (fileInput) {
            fileInput.click();
        }
    });


    dropZone.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (fileInput) {
                fileInput.click();
            }
        }
    });
}


// =====================================================
// Quality slider
// =====================================================

if (quality && qualityValue) {

    quality.addEventListener("input", () => {

        qualityValue.textContent =
            `${quality.value}%`;

        document
            .querySelectorAll(".presets button")
            .forEach(button => {
                button.classList.remove("active");
            });
    });
}


// =====================================================
// Quality presets
// =====================================================

document
    .querySelectorAll(".presets button")
    .forEach(button => {

        button.addEventListener("click", () => {

            const value = button.dataset.quality;

            if (quality) {
                quality.value = value;
            }

            if (qualityValue) {
                qualityValue.textContent =
                    `${value}%`;
            }

            document
                .querySelectorAll(".presets button")
                .forEach(item => {
                    item.classList.remove("active");
                });

            button.classList.add("active");
        });

    });


// =====================================================
// Compress image
// =====================================================

function compressFile(file, qualityValueNumber) {

    return new Promise((resolve, reject) => {

        const image = new Image();

        const objectURL =
            URL.createObjectURL(file);


        image.onload = () => {

            const maxDimension = 2400;

            const largestDimension =
                Math.max(
                    image.naturalWidth,
                    image.naturalHeight
                );


            const scale =
                Math.min(
                    1,
                    maxDimension / largestDimension
                );


            const width =
                Math.max(
                    1,
                    Math.round(
                        image.naturalWidth * scale
                    )
                );


            const height =
                Math.max(
                    1,
                    Math.round(
                        image.naturalHeight * scale
                    )
                );


            const canvas =
                document.createElement("canvas");


            canvas.width = width;
            canvas.height = height;


            const context =
                canvas.getContext("2d");


            if (!context) {

                URL.revokeObjectURL(objectURL);

                reject(
                    new Error("Canvas not supported")
                );

                return;
            }


            // White background for JPG/JPEG
            // so transparent pixels don't become black.

            if (file.type === "image/jpeg") {

                context.fillStyle = "#ffffff";

                context.fillRect(
                    0,
                    0,
                    width,
                    height
                );
            }


            context.drawImage(
                image,
                0,
                0,
                width,
                height
            );


            const outputType =
                getOutputType(file);


            if (!outputType) {

                URL.revokeObjectURL(objectURL);

                reject(
                    new Error("Unsupported image format")
                );

                return;
            }


            canvas.toBlob(
                blob => {

                    URL.revokeObjectURL(objectURL);


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


        image.onerror = () => {

            URL.revokeObjectURL(objectURL);

            reject(
                new Error("Invalid image")
            );
        };


        image.src = objectURL;
    });
}


// =====================================================
// Compress button
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


            compressBtn.disabled = true;

            compressBtn.innerHTML =
                "Compressing...";


            results = [];


            try {

                for (
                    let i = 0;
                    i < files.length;
                    i++
                ) {

                    const result =
                        await compressFile(
                            files[i],
                            Number(quality.value)
                        );


                    results.push(result);

                    renderFiles();
                }


                calculateSummary();

                summary.hidden = false;


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

                compressBtn.disabled = false;

                compressBtn.innerHTML =
                    'Compress Images <span>→</span>';
            }

        }
    );
}


// =====================================================
// Summary
// =====================================================

function calculateSummary() {

    const original =
        files.reduce(
            (total, file) => {
                return total + file.size;
            },
            0
        );


    const compressed =
        results.reduce(
            (total, result) => {
                return total + result.blob.size;
            },
            0
        );


    const saved =
        Math.max(
            0,
            original - compressed
        );


    const reduction =
        original > 0
            ? (saved / original) * 100
            : 0;


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
// Individual download
// =====================================================

function downloadResult(index) {

    const result =
        results[index];


    const file =
        files[index];


    if (!result || !file) {
        return;
    }


    const url =
        URL.createObjectURL(
            result.blob
        );


    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        createDownloadName(file);


    document.body.appendChild(link);

    link.click();

    link.remove();


    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
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
                fileInput.value = "";
            }

            summary.hidden = true;

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
                fileInput.value = "";
            }

            summary.hidden = true;

            renderFiles();

            const compressor =
                document.getElementById("compressor");

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
                    item.classList.contains("open");


                document
                    .querySelectorAll(".faq-item")
                    .forEach(other => {
                        other.classList.remove("open");
                    });


                if (!isOpen) {
                    item.classList.add("open");
                }
            }
        );

    });


// =====================================================
// Mobile menu
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
// Initial state
// =====================================================

renderFiles();