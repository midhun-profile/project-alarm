# Firebase Alarm System

This is a Next.js web application that provides a user dashboard for viewing alarm messages from a Firebase security system. It features user authentication, real-time data fetching, and a paginated display of alarm messages. The application is designed to be performant and secure, with server-side data fetching to protect sensitive information and minimize client-side load.

## Project Overview

This application demonstrates the integration of Next.js with Firebase services to create a real-time monitoring dashboard. The key features include:

- **User Authentication:** Secure user login and registration using Firebase Authentication.
- **User Dashboard:** A personalized dashboard that displays user-specific information.
- **Real-Time Alarm Messages:** A real-time display of the 10 most recent alarm messages from a Firestore database, sorted by timestamp.
- **Pagination:** A paginated view of alarm messages for easy navigation.
- **Server-Side Data Fetching:** Efficient and secure data fetching using a Next.js API route and the Firebase Admin SDK.
- **Responsive Design:** A responsive user interface built with Tailwind CSS that works on both desktop and mobile devices.

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm
- A Firebase project

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone <repository-url>
```

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
npm install
```

### 3. Set Up Firebase

1. **Create a Firebase Project:**
   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Enable Firestore and Authentication:**
   - In the Firebase console, go to the **Firestore Database** section and create a new database.
   - Go to the **Authentication** section and enable the **Email/Password** sign-in method.

3. **Get Firebase Configuration:**
   - In your Firebase project settings, go to the **Project settings** and scroll down to the **Your apps** section.
   - Click on the web app icon (`</>`) to create a new web app.
   - Copy the Firebase configuration object. You will need this for your `.env.local` file.

4. **Create a Service Account:**
   - In your Firebase project settings, go to the **Service accounts** tab.
   - Click on **Generate new private key** to download a JSON file with your service account credentials.

### 4. Configure Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```env
# Firebase client configuration
NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>

# Firebase admin configuration (for server-side rendering)
FIREBASE_CLIENT_EMAIL=<your-firebase-client-email>
FIREBASE_PRIVATE_KEY=<your-firebase-private-key>
```

- Replace the placeholder values with the credentials from your Firebase project and the service account JSON file.

### 5. Run the Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Authentication Workflow

### Registration Workflow

1.  **Navigate to Register Page:** The user goes to the `/register` page.
2.  **Fill Form:** The user enters their name, email, password, location, building, and floor.
3.  **Submit Form:** Upon submission, the `handleRegister` function is triggered.
4.  **Create User:** A new user is created in Firebase Authentication using `createUserWithEmailAndPassword`.
5.  **Store User Data:** A corresponding document is created in the `demologin` collection in Firestore, storing the user's details and their unique `uid`.

-   **Files Involved:**
    -   `app/register/page.tsx`: Contains the UI and logic for the registration form.
    -   `lib/firebaseClient.ts`: Initializes the client-side Firebase SDK for authentication.

### Login Workflow

1.  **Navigate to Login Page:** The user goes to the `/login` page.
2.  **Enter Credentials:** The user enters their email and password.
3.  **Submit Form:** Upon submission, the `handleLogin` function is called.
4.  **Authenticate User:** Firebase authenticates the user's credentials using `signInWithEmailAndPassword`.
5.  **Redirect to Dashboard:** Upon successful login, the user is redirected to the main dashboard at `/`.

-   **Files Involved:**
    -   `app/login/page.tsx`: Contains the UI and logic for the login form.
    -   `lib/firebaseClient.ts`: Initializes the client-side Firebase SDK for authentication.
    -   `lib/withAuth.ts`: A Higher-Order Component that protects routes from unauthenticated access.
    -   `lib/useAuth.ts`: A React hook to access the current user's authentication state.

### Logout Workflow

1.  **Click Logout:** The user clicks the "Logout" button on the main dashboard.
2.  **Sign Out:** The `handleLogout` function calls `auth.signOut()` to sign the user out of Firebase.
3.  **Redirect to Login:** The user is then redirected to the `/login` page.

-   **Files Involved:**
    -   `app/page.tsx`: The main dashboard page containing the logout button and logic.
    -   `lib/firebaseClient.ts`: Provides the `auth.signOut()` method.

### Token-Based Authentication

This application uses token-based authentication to secure the communication between the client and the server. Here's how it works:

1.  **Token Generation:**
    *   When a user successfully logs in, the Firebase Authentication service generates a JSON Web Token (JWT), also known as an ID Token.
    *   This token contains information (claims) about the user, such as their unique ID (`uid`), and is digitally signed by Firebase.

2.  **Token on the Client:**
    *   The client-side application receives this ID token and stores it.
    *   The `useAuth` hook makes it easy to access the current user and their token.

3.  **Authorizing API Requests:**
    *   When the client needs to fetch protected data from the server (e.g., user details and messages), it makes a request to the `/api/userData` API route.
    *   Before sending the request, it retrieves the user's ID token and includes it in the `Authorization` header, using the `Bearer` scheme.
        ```
        Authorization: Bearer <your-id-token>
        ```

4.  **Token Verification on the Server:**
    *   The server-side API route (`app/api/userData/route.ts`) receives the request and extracts the ID token from the `Authorization` header.
    *   It then uses the Firebase Admin SDK's `verifyIdToken()` method to check the token's validity. This verification process ensures that the token was actually issued by your Firebase project and has not been tampered with or expired.
    *   If the token is valid, the server can trust the `uid` inside the token. It uses this `uid` to securely fetch the correct user's data from the Firestore database.
    *   If the token is invalid, the server rejects the request with a `401 Unauthorized` error, preventing unauthorized access to data.

-   **Files Involved:**
    -   `app/page.tsx`: Fetches the token from the authenticated user and sends it in the API request header.
    -   `app/api/userData/route.ts`: Receives the token, verifies it using the Firebase Admin SDK, and uses the decoded `uid` to fetch data.
    -   `lib/firebaseAdmin.ts`: Initializes the Firebase Admin SDK required for token verification on the server.

This token-based mechanism ensures that the server can stateless-ly and securely verify a user's identity on every request to a protected endpoint.

## User Data Storage

User data is stored in a Firestore collection named `demologin`. When a new user registers, a new document is added to this collection. Each document is identified by a unique ID, and it contains the following fields:

-   `uid`: The user's unique ID from Firebase Authentication.
-   `name`: The user's name.
-   `email`: The user's email address.
-   `location`: The user's location.
-   `building`: The user's building.
-   `floor`: The user's floor.

This data is used to personalize the user dashboard and can be extended to include other relevant user information.

## Troubleshooting

### 500 Internal Server Error

A 500 Internal Server Error typically indicates a problem with the server-side code. The most common cause is a misconfiguration of the Firebase Admin SDK, which is usually due to missing or incorrect environment variables.

To resolve this issue, make sure that:

- You have created a `.env.local` file in the root of your project.
- The `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` environment variables are set correctly in the `.env.local` file.
- The service account credentials are correct and have the necessary permissions.

If you continue to experience issues, you can check the server-side logs for more detailed error information. In this project, the API route at `app/api/userData/route.ts` has been configured to return a detailed error message in the event of a server-side error.
