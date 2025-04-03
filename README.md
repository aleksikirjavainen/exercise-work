# 🔐 Secure File Sharing App

This project is a secure file-sharing web application built with **React**, **Node.js**, and **TypeScript**, following secure programming practices based on the **OWASP Top 10** guidelines.

---

## ✅ Security Features Implemented

### 🔒 User Authentication
- **Secure Registration & Login**
- Passwords are **hashed with bcrypt**
- **JWTs** are used for session management

---

### 🛡️ Protected Routes
- Frontend routes like `/dashboard` are secured using a `PrivateRoute` component
- Backend verifies JWT tokens on endpoints like `/api/me`
- **Logout functionality** clears session data and redirects safely

---

### 🧪 Dependency Vulnerability Scanning (**OWASP A06**)
- **OWASP Dependency-Check** integrated into CI/CD using GitHub Actions
- Runs on **every push and pull request**
- Scans both `client/` and `server/` for vulnerable packages
- Uses an **NVD API Key** to speed up CVE database downloads
- Uploads results as **HTML reports** for download and review

---

### 🧹 Static Code Analysis (SonarQube)
- **SonarCloud** integration via GitHub Actions
- Runs on **every push and pull request**
- Detects **security hotspots**, **code smells**, and **potential bugs**

---

### 🔐 Broken Access Control (**OWASP A01**)
- Authenticated users are the only ones who can access protected resources
- Server-side checks ensure token validity before allowing access

---

### ⚙️ Security Misconfiguration (**OWASP A05**)
- **CORS** is configured to allow access only from `http://localhost:3000` during development

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
