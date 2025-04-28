# Secure File Sharing App

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
