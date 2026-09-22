document.addEventListener("DOMContentLoaded", function () {
    // Modal elements
    const editModal = document.getElementById("edit-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");

    // Display elements
    const displayAvatar = document.getElementById("display-avatar");
    const topbarAvatar = document.getElementById("topbar-avatar");
    const displayName = document.getElementById("display-name");
    const displayCourse = document.getElementById("display-course");
    const displayYear = document.getElementById("display-year");
    const displayAbout = document.getElementById("display-about");
    const displaySkills = document.getElementById("display-skills");

    // Input elements inside modal
    const inputAvatar = document.getElementById("input-avatar");
    const avatarPreview = document.getElementById("avatar-preview");
    const inputName = document.getElementById("input-name");
    const inputCourse = document.getElementById("input-course");
    const inputYear = document.getElementById("input-year");
    const inputAbout = document.getElementById("input-about");
    const inputSkills = document.getElementById("input-skills");

    // Control buttons
    const topbarProfileBtn = document.getElementById("topbar-profile-btn");
    const saveBtn = document.getElementById("save-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const errorMessage = document.getElementById("error-message");

    // 1. Load profile data from localStorage if available
    function loadProfileData() {
        const savedData = localStorage.getItem("studentProfile");
        if (savedData) {
            try {
                const profile = JSON.parse(savedData);
                if (profile.avatar) {
                    displayAvatar.src = profile.avatar;
                    topbarAvatar.src = profile.avatar;
                }
                displayName.textContent = profile.name || "Gio Carlo E. Duldoco";
                displayCourse.textContent = profile.course || "Bachelor of Science in Information Technology";
                displayYear.textContent = profile.year || "2nd year";
                displayAbout.textContent = profile.about || "I am a 2nd Year BSIT student";
                displaySkills.textContent = profile.skills || "Volleyball Athlete, Java and Python Enthusiast, Cooking";
            } catch (e) {
                console.error("Error parsing saved profile data from localStorage", e);
            }
        }
    }

    // Modal Control Functions
    function openModal() {
        // Populate inputs with current page data
        inputName.value = displayName.textContent;
        inputCourse.value = displayCourse.textContent;
        inputYear.value = displayYear.textContent;
        inputAbout.value = displayAbout.textContent;
        inputSkills.value = displaySkills.textContent;

        avatarPreview.src = displayAvatar.src;
        inputAvatar.value = ""; 

        errorMessage.textContent = "";
        editModal.classList.add("active");
        editModal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        errorMessage.textContent = "";
        editModal.classList.remove("active");
        editModal.setAttribute("aria-hidden", "true");
    }

    // Event Trigger to Open Modal (Top Right Profile Pic)
    if (topbarProfileBtn) {
        topbarProfileBtn.addEventListener("click", openModal);
    }

    // Event Triggers to Close Modal
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

    // Close modal if user clicks outside content window
    editModal.addEventListener("click", function (event) {
        if (event.target === editModal) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && editModal.classList.contains("active")) {
            closeModal();
        }
    });

    // Live preview when selecting a new picture
    inputAvatar.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                avatarPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Save Profile Changes
    saveBtn.addEventListener("click", function () {
        const nameVal = inputName.value.trim();
        const courseVal = inputCourse.value.trim();
        const yearVal = inputYear.value.trim();
        const aboutVal = inputAbout.value.trim();
        const skillsVal = inputSkills.value.trim();
        const newAvatarData = avatarPreview.src;

        // Validation check
        if (!nameVal || !courseVal || !yearVal || !aboutVal || !skillsVal) {
            errorMessage.textContent = "[ERROR] All fields are required. Please complete the form.";
            return;
        }

        const updatedProfile = {
            avatar: newAvatarData,
            name: nameVal,
            course: courseVal,
            year: yearVal,
            about: aboutVal,
            skills: skillsVal
        };

        // Save into localStorage
        try {
            localStorage.setItem("studentProfile", JSON.stringify(updatedProfile));
        } catch (e) {
            console.error("localStorage error", e);
            errorMessage.textContent = "[ERROR] Image size too large to save. Please select a smaller photo.";
            return;
        }

        // Update DOM elements on page
        displayAvatar.src = newAvatarData;
        topbarAvatar.src = newAvatarData;
        displayName.textContent = nameVal;
        displayCourse.textContent = courseVal;
        displayYear.textContent = yearVal;
        displayAbout.textContent = aboutVal;
        displaySkills.textContent = skillsVal;

        closeModal();
    });

    // Initialize page
    loadProfileData();
});