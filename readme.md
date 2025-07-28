# Note-Taking Web Application

A full-stack note-taking application that allows users to sign up, log in, and manage their personal notes securely.

## Features

- **User Signup:** New users can register using their email and an OTP sent to their inbox.
- **User Sign In:** Existing users can log in using their email and a new OTP.
- **Google Auth:** Users can sign up or sign in instantly with their Google account.
- **Create & Delete Notes:** Once logged in, users can create new notes and delete their existing ones.
- **Secure:** User actions are protected using JSON Web Tokens (JWT).
- **Responsive Design:** The interface looks great on both mobile phones and laptops.

## Tech Stack

- **Frontend:** React (with TypeScript), Vite, Tailwind CSS
- **Backend:** Node.js, Express (with TypeScript)
- **Database:** MongoDB (using Mongoose)

---

## Setup Instructions

To run this project on your local machine, follow these steps.

### Backend Setup

1.  **Go to the backend folder:**
    ```bash
    cd note-app-server
    ```

2.  **Install the necessary packages:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    - Create a new file named `.env` in the `note-app-server` folder.
    - Copy the content from the "Environment Variables" section below into this file.
    - Fill in your own secret keys and passwords.

4.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

### Frontend Setup

1.  **Go to the frontend folder:**
    ```bash
    cd note-app-client
    ```

2.  **Install the necessary packages:**
    ```bash
    npm install
    ```

3.  **Start the frontend application:**
    ```bash
    npm run dev
    ```
    The application will open in your browser, usually at `http://localhost:5173`.

---

## Environment Variables

You need to create a `.env` file in the `note-app-server` folder and add the following content.

```env
# The port for the backend server
PORT=5000

# Your connection link from MongoDB Atlas
MONGO_URI=your_mongodb_connection_string

# A long, random secret for security
JWT_SECRET=your_super_secret_key_for_jwt

# Your credentials from the Google Cloud Console
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Your Gmail address and the 16-character App Password for sending OTPs
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# The URL where your frontend is running
FRONTEND_URL=http://localhost:5173