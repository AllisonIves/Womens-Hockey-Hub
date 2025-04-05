import React from "react";
import { getAuth, signOut } from "firebase/auth";
import "/src/styles/Login.css";

const Logout = () => {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;

      // Log user out from Firebase
      await signOut(auth);

      // Clear emailVerified session status
      sessionStorage.setItem("emailVerified", "false");

      // Notify the backend
      if (user?.uid) {
        await fetch("http://localhost:5000/api/users/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
      }

      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Are you sure you want to log out?</h2>
        <button onClick={handleLogout} className="google-login-button">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Logout;
