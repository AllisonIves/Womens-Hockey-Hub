import React from "react";
import {
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "/src/firebase-config";
import "/src/styles/Login.css";

/**
 * Login component handles user sign-in via Google using Firebase Authentication.
 * On successful login, session persistence is set, user data is saved in sessionStorage,
 * and a POST request is sent to the backend to register the user.
 *
 * @component
 * @returns {JSX.Element} Rendered login page with Google sign-in button.
 */

const Login = () => {
  const signInWithGoogle = async () => {
    try {
      // Ensure session-based login
      await setPersistence(auth, browserSessionPersistence);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Set sessionStorage flags
      sessionStorage.setItem("emailVerified", user.emailVerified ? "true" : "false");
      sessionStorage.setItem("displayName", user.displayName);

      // Send user to backend
      await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerId: user.providerData[0]?.providerId || "google",
          isAdmin: false
        }),
      });

      // Redirect
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Login to Women's Hockey Hub</h2>
        <button onClick={signInWithGoogle} className="google-login-button">
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
