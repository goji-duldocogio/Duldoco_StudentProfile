document.addEventListener("DOMContentLoaded", function () {

    const DEFAULT_PROFILE = {
        avatar: "img/profile.jpg",
        name: "Gio Carlo E. Duldoco",
        course: "Bachelor of Science in Information Technology",
        year: "3rd year",
        about: "I like to cook, play sport, draw, and innovate ideas as my personal hobby. I am also curious in things that are caught my interest.",
        skills: "Java, Python, HTML, CSS, JavaScript, SQL, Web Designer, Graphic Designer"
    };

    // DOM Elements
    const editModal = document.getElementById("edit-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");

    const displayAvatar = document.getElementById("display-avatar");
    const topbarAvatar = document.getElementById("topbar-avatar");
    const displayName = document.getElementById("display-name");
    const displayCourse = document.getElementById("display-course");
    const displayYear = document.getElementById("display-year");
    const displayAbout = document.getElementById("display-about");
    const displaySkills = document.getElementById("display-skills");

    const inputAvatar = document.getElementById("input-avatar");
    const avatarPreview = document.getElementById("avatar-preview");
    const inputName = document.getElementById("input-name");
    const inputCourse = document.getElementById("input-course");
    const inputYear = document.getElementById("input-year");
    const inputAbout = document.getElementById("input-about");
    const inputSkills = document.getElementById("input-skills");

    const openCameraBtn = document.getElementById("open-camera-btn");
    const webcamContainer = document.getElementById("webcam-container");
    const webcamVideo = document.getElementById("webcam-video");
    const snapBtn = document.getElementById("snap-btn");

    const topbarProfileBtn = document.getElementById("topbar-profile-btn");
    const saveBtn = document.getElementById("save-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const resetBtn = document.getElementById("reset-btn");
    const errorMessage = document.getElementById("error-message");

    let mediaStream = null;

    /**
     * Handles Camera Capture
     * Fully meets Cordova Requirements (Tests 1, 2, 3, 4, 6)
     */
    function handleCamera() {
        if (errorMessage) errorMessage.textContent = "";

        // MODE A: Native Cordova Environment (Tests 1, 2, 3, 4, 6)
        if (window.cordova && navigator.camera && typeof navigator.camera.getPicture === "function") {
            const cameraOptions = {
                quality: 60, // Optimized quality to prevent memory overhead
                destinationType: Camera.DestinationType.DATA_URL, // Return base64 string
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                correctOrientation: true,
                targetWidth: 500,
                targetHeight: 500
            };

            // Test 2 & Test 3: Success Callback
            function onSuccess(imageData) {
                let formattedImage = "";
                if (imageData.startsWith("data:image") || imageData.startsWith("file://") || imageData.startsWith("content://")) {
                    formattedImage = imageData;
                } else {
                    formattedImage = "data:image/jpeg;base64," + imageData;
                }
                avatarPreview.src = formattedImage;
            }

            // Test 4 & Test 6: Error / Cancel Callback
            function onError(message) {
                const lowerMsg = (message || "").toLowerCase();

                // Test 4: Cancel Camera (Keep existing picture, do nothing)
                if (lowerMsg.includes("cancel") || lowerMsg.includes("no image") || lowerMsg.includes("selection cancelled")) {
                    console.log("Camera operation cancelled by user. Existing profile picture preserved.");
                    return;
                }

                // Test 6: Camera Errors & Permission Denials
                console.error("Cordova Camera Error:", message);
                if (lowerMsg.includes("permission") || lowerMsg.includes("denied")) {
                    if (errorMessage) errorMessage.textContent = "[ERR] Camera permission denied. Enable access in app settings.";
                } else if (lowerMsg.includes("unavailable") || lowerMsg.includes("has no camera")) {
                    if (errorMessage) errorMessage.textContent = "[ERR] Hardware camera device unavailable.";
                } else {
                    if (errorMessage) errorMessage.textContent = "[ERR] Camera error: " + message;
                }
            }

            // Test 1: Open Camera
            try {
                navigator.camera.getPicture(onSuccess, onError, cameraOptions);
            } catch (err) {
                console.error("Exception invoking navigator.camera:", err);
                if (errorMessage) errorMessage.textContent = "[ERR] Failed to launch device camera.";
            }
        }
        // MODE B: Desktop Live Server WebRTC Fallback
        else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    mediaStream = stream;
                    webcamVideo.srcObject = stream;
                    if (webcamContainer) webcamContainer.style.display = "block";
                })
                .catch(function (err) {
                    console.error("Webcam access error:", err);
                    if (errorMessage) errorMessage.textContent = "[ERR] Could not access browser camera.";
                });
        } 
        // MODE C: Standard File Fallback
        else {
            if (inputAvatar) inputAvatar.click();
        }
    }

    // Snap photo from browser webcam preview stream
    if (snapBtn) {
        snapBtn.addEventListener("click", function () {
            if (!webcamVideo.videoWidth) return;
            const canvas = document.createElement("canvas");
            canvas.width = webcamVideo.videoWidth;
            canvas.height = webcamVideo.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(webcamVideo, 0, 0, canvas.width, canvas.height);
            avatarPreview.src = canvas.toDataURL("image/jpeg");
            stopWebcamStream();
        });
    }

    function stopWebcamStream() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
        if (webcamContainer) webcamContainer.style.display = "none";
    }

    // Load Profile Data from localStorage (Test 5: Restart Application)
    function loadProfileData() {
        const savedData = localStorage.getItem("studentProfile");
        let profile = DEFAULT_PROFILE;

        if (savedData) {
            try {
                profile = { ...DEFAULT_PROFILE, ...JSON.parse(savedData) };
            } catch (e) {
                console.error("Error parsing profile data:", e);
            }
        }
        renderProfile(profile);
    }

    function renderProfile(profile) {
        if (profile.avatar) {
            displayAvatar.src = profile.avatar;
            topbarAvatar.src = profile.avatar;
        }
        displayName.textContent = profile.name;
        displayCourse.textContent = profile.course;
        displayYear.textContent = profile.year;
        displayAbout.textContent = profile.about;
        displaySkills.textContent = profile.skills;
    }

    // Modal Display Handlers
    function openModal() {
        inputName.value = displayName.textContent;
        inputCourse.value = displayCourse.textContent;
        inputYear.value = displayYear.textContent;
        inputAbout.value = displayAbout.textContent;
        inputSkills.value = displaySkills.textContent;

        avatarPreview.src = displayAvatar.src;
        if (inputAvatar) inputAvatar.value = "";

        if (errorMessage) errorMessage.textContent = "";
        editModal.classList.add("active");
        editModal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        stopWebcamStream();
        if (errorMessage) errorMessage.textContent = "";
        editModal.classList.remove("active");
        editModal.setAttribute("aria-hidden", "true");
    }

    // Event Listeners
    if (topbarProfileBtn) topbarProfileBtn.addEventListener("click", openModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (openCameraBtn) openCameraBtn.addEventListener("click", handleCamera);

    if (inputAvatar) {
        inputAvatar.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    avatarPreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Save Changes Handler
    saveBtn.addEventListener("click", function () {
        if (!inputName.value.trim() || !inputCourse.value.trim() || !inputYear.value.trim()) {
            if (errorMessage) errorMessage.textContent = "[ERROR] Required fields are missing.";
            return;
        }

        const updatedProfile = {
            avatar: avatarPreview.src,
            name: inputName.value.trim(),
            course: inputCourse.value.trim(),
            year: inputYear.value.trim(),
            about: inputAbout.value.trim(),
            skills: inputSkills.value.trim()
        };

        try {
            localStorage.setItem("studentProfile", JSON.stringify(updatedProfile));
            renderProfile(updatedProfile);
            closeModal();
        } catch (e) {
            console.error("Storage save error:", e);
            if (errorMessage) errorMessage.textContent = "[ERROR] Could not save to localStorage.";
        }
    });

    // Reset Defaults Handler
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            if (confirm("Reset profile to default?")) {
                localStorage.removeItem("studentProfile");
                renderProfile(DEFAULT_PROFILE);
                closeModal();
            }
        });
    }

    loadProfileData();
});