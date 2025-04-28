# 🔐 Secure File Sharing App

This project is a secure file-sharing web application built with React, Node.js, and TypeScript, following secure programming practices based on the OWASP Top 10 guidelines.

Follow these steps to run the project locally:

1. Clone the repository

- git clone git@github.com:aleksikirjavainen/exercise-work.git
- cd exercise-work

2. Install dependencies
- npm install
- npm install --prefix server
- npm install --prefix ui

3. Set up environment variables

- cd server
- touch .env
- Add the following line to /server/.env:
- JWT_SECRET=your_super_secret_jwt_key

4. Run the backend server

- cd server
- npm run dev
- The backend will be available at http://localhost:5000.

5. Run the frontend UI

- cd ../ui
- npm start
- The UI will be available at http://localhost:3000.

## ✅ Security Features Implemented

### 🔒 User Authentication
- Secure Registration & Login forms with server-side validation
- Passwords are hashed securely using bcrypt
- JWTs are used for session management, stored in HttpOnly cookies
- Tokens have a 1-day expiration for session control

---

### 🛡️ Protected Routes
- Frontend routes like `/dashboard` and `/files` are secured using a `PrivateRoute` component
- Backend APIs verify JWT tokens before responding
- Logout clears the authentication cookie to fully log out the session

---

### 📁 Secure File Handling
- Uploaded files are sanitized to remove unsafe characters
- File extensions are restricted to `.png`, `.jpg`, `.jpeg`, `.pdf`, and `.txt`
- Maximum file size is limited to 10MB
- Path traversal is blocked on download and delete endpoints by validating paths

---

### 🧪 Dependency Vulnerability Scanning (**OWASP A06**)
- OWASP Dependency-Check integrated into CI/CD using GitHub Actions
- Runs on every push and pull request
- Scans both `server/` and `ui/` for vulnerable dependencies
- Uses an NVD API Key to speed up vulnerability database access
- Generates HTML reports for vulnerability review

---

### 🧹 Static Code Analysis (SonarQube)
- SonarCloud integration via GitHub Actions
- Runs on every push and pull request
- Analyzes code for bugs, security hotspots, and maintainability issues
- Tracks code test coverage

---

### 🔐 Broken Access Control (**OWASP A01**)
- Only authenticated users can list, upload, download, or delete their own files
- Filenames are prefixed with user's sanitized email to separate user data
- Server validates user identity on every protected route

---

### ⚙️ Security Misconfiguration (**OWASP A05**)
- CORS is configured to only allow requests from `http://localhost:3000` in development
- Express "X-Powered-By" header is disabled to prevent technology disclosure

---

### 🧹 Input Validation and Sanitization (**OWASP A03**)
- Express-validator used to validate registration and login inputs
- Filenames are sanitized before saving to disk
- Only allowed file extensions are accepted during upload

---

## 🛠️ Technologies Used

| Area      | Tech Stack                       |
|-----------|----------------------------------|
| Frontend  | React + TypeScript               |
| Backend   | Node.js + Express                |
| Auth      | JWT + bcrypt                     |
| CI/CD     | GitHub Actions                   |
| Security  | OWASP Dependency-Check, SonarCloud |
| Styling   | Basic CSS                        |

---

# 📢 Notes
- This project focuses primarily on implementing secure coding patterns for a small application.
- Some additional production features like advanced CSRF protection and file virus scanning are outside the project scope.
