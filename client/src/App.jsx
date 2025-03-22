import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import CommunityEventPage from "./CommunityEventPage";
import CommunityEventForm from "./CommunityEventForm.jsx";
import Chat from "./Pages/Chat.jsx";
import Login from "./Pages/Login.jsx";
import Logout from "./Pages/Logout.jsx";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "/src/firebase-config";

const App = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Track Firebase login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        sessionStorage.setItem("emailVerified", "true");
        setFirebaseUser(user);
      } else {
        sessionStorage.setItem("emailVerified", "false");
        setFirebaseUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Inactivity Timer
  useEffect(() => {
    let timeout;

    const logoutForInactivity = async () => {
      console.log("Inactivity detected. Logging out...");
      sessionStorage.setItem("emailVerified", "false");
      setFirebaseUser(null);
      setShowPopup(true);
      await signOut(auth);
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logoutForInactivity, 30 * 60 * 1000); // 30 minute timer
    };

    // Listen for navigation or clicks
    window.addEventListener("click", resetTimer);
    window.addEventListener("popstate", resetTimer);

    resetTimer(); // Start timer on mount

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("popstate", resetTimer);
    };
  }, []);

  return (
    <Router>
      <nav>
        <Link to="/events">Community Events </Link>
        {firebaseUser && (
          <>
            <Link to="/post-event">Post Event </Link>
            <Link to="/chat">Chat </Link>
            <Link to="/logout">Logout </Link>
          </>
        )}
        {!firebaseUser && <Link to="/login">Login</Link>}
      </nav>

      {showPopup && (
        <div className="inactivity-popup">
          <p>You have been logged out due to inactivity.</p>
        </div>
      )}

      <Routes>
        <Route path="/events" element={<CommunityEventPage />} />
        <Route
          path="/post-event"
          element={
            firebaseUser ? (
              <CommunityEventForm onEventSubmit={() => {}} />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/chat" element={firebaseUser ? <Chat /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;
