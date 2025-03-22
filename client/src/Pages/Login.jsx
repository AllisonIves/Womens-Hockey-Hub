import React from "react";
import { getAuth, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "/src/firebase-config";
import "/src/styles/Login.css";

const Login = () => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Signed in user:", user);

      // Store emailVerified status as a string in sessionStorage
      sessionStorage.setItem("emailVerified", user.emailVerified ? "true" : "false");

      // Send user info to backend
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerId: user.providerData[0]?.providerId || "google",
        }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      // Redirect to homepage
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login to Women's Hockey Hub</h2>
      <button onClick={signInWithGoogle} className="google-login-button">
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
