# Duldoco_StudentProfile

## 1. Project Description

A multi-page Student Profile application built with HTML, CSS, JavaScript, and Apache Cordova.

Originally developed as a static multi-page app, Activity 5 introduces dynamic profile editing, client-side form validation, live avatar photo previews, and local data persistence via `localStorage`. The application retains its responsive cyber/terminal aesthetic while providing interactive, mobile-ready profile management.

---

## 2. Application Pages

| Page | File | Purpose |
| --- | --- | --- |
| **Profile** | `www/index.html` | The main landing page. Displays personal info, course, year level, bio, and skills summary, with quick links to other sections and top-bar profile editing access. |
| **About** | `www/about.html` | The personal background section. Features personal bio paragraphs along with panels for interests, education, and future aspirations. |
| **Skills** | `www/skills.html` | Categorized showcase of technical skills across programming/development, web design, and tools/workflows. |
| **Projects** | `www/projects.html` | Portfolio displaying key projects, descriptions, contributions, and tech stacks used. |
| **Contact** | `www/contact.html` | Displays contact information (email, GitHub, location) and a sample contact form layout. |

---

## 3. Profile Editing

The application includes an interactive modal interface (`edit_profile.sh`) that allows users to modify their profile information directly on the homepage. 

Users trigger the modal by hovering over or clicking the profile picture icon in the top-right navigation bar (which displays an "Edit Profile" popup) or by clicking the main profile picture.

### Modifiable Information:
- **Profile Picture**: Image upload via local file input with real-time preview.
- **Full Name**: Student's display name.
- **Course**: Academic degree program.
- **Year Level**: Current academic year.
- **About Me**: Brief personal bio.
- **Skills**: Comma-separated list of technical capabilities and hobbies.

---

## 4. JavaScript Functionality

All dynamic interactions are handled in `script.js`:

- **Form Handling:** Listens for user actions to open and close the modal dialog, populates form inputs with current DOM values on open, and processes local file selections via the FileReader API for real-time photo previewing.
- **Validation:** Implements client-side checks before saving. Verifies that no required fields are left empty (`!nameVal || !courseVal || ...`). If any input is missing, an error message (`[ERROR] All fields are required. Please complete the form.`) is displayed inside the modal without closing it.
- **Profile Updates:** Reads newly validated inputs and dynamically updates the corresponding DOM elements on the page (`#display-name`, `#display-course`, `#display-year`, `#display-about`, `#display-skills`, `#display-avatar`, and `#topbar-avatar`).
- **Save:** Triggered by the "Save Changes" button. Validates input values, serializes the updated profile into JSON, stores the data in `localStorage`, updates the UI, and closes the modal window.
- **Cancel:** Triggered by the "Cancel" button, the modal close (`×`) button, clicking outside the modal overlay, or pressing the `Escape` key. Reverts pending changes and closes the overlay without altering saved data.

---

## 5. Local Data Storage

The application uses `localStorage` to persist user profile modifications across browser refreshes and application restarts:

- **Storage (`setItem`):** Upon clicking "Save Changes", the profile object containing the avatar Data URL, name, course, year level, about bio, and skills list is converted into a JSON string using `JSON.stringify()` and stored under the key `'studentProfile'`.
- **Retrieval (`getItem`):** When the page finishes loading (`DOMContentLoaded`), `loadProfileData()` checks if `'studentProfile'` exists in `localStorage`. If found, it parses the JSON string using `JSON.parse()` and populates the profile card and header avatar with the saved values. If no saved data exists, default content is displayed.

---

## 6. Responsive Design

The layout uses a mobile-first approach with standard media queries:

- **Mobile (under 640px):** Single-column layout. Navigation displays at the bottom of the screen as a fixed tab bar within easy thumb reach.
- **Tablet (640px to 999px):** Content expands into multi-column panel grids. At 700px, navigation moves up into the main header bar.
- **Desktop (1000px and above):** Expands to a multi-column design capped at a maximum width of `900px` for optimal readability, with scaled spacing and responsive modal overlays.

---

## 7. How to Run

### Requirements
- Node.js 20.17.0 or later
- Java JDK 17
- Android Studio with SDK Platform 36 and Build Tools 36.0.0
- `JAVA_HOME` and `ANDROID_HOME` environment variables set
- Apache Cordova CLI (`npm install -g cordova`)

### Build and Run on Android

```bash
# 1. Install dependencies
npm install

# 2. Add Android platform
cordova platform add android

# 3. Check environment prerequisites
cordova requirements

# 4. Build application
cordova build android

# 5. Run on device or emulator
cordova run android

## 7. Application Screenshots

### Profile (Homepage)
![Profile Page](screenshots/studentprofile.png)

### About
![About Page](screenshots/about.png)

### Skills
![Skills Page](screenshots/skills.png)

### Projects
![Projects Page](screenshots/projects.png)

### Contact
![Contact Page](screenshots/contact.png)

### Responsive Layouts

| Desktop | Tablet | Mobile |
| --- | --- | --- |
| ![Desktop View](screenshots/desktop.png) | ![Tablet View](screenshots/tablet.png) | ![Mobile View](screenshots/mobile.png) |

# Edit and Update Profile

### Edit Profile
![Edit Profile](screenshots/editprofile.png)

### Update Profile
![Update Profile](screenshots/updatedprofile.png)