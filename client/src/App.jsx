import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import News from "./Pages/News.jsx";
import CommunityEventPage from "./CommunityEventPage";
import CommunityEventForm from "./CommunityEventForm.jsx";
import Chat from "./Pages/Chat.jsx";
import Login from "./Pages/Login.jsx";
import Logout from "./Pages/Logout.jsx";
import ContactForm from "./Pages/ContactForm";
import ForumLanding from "./Pages/ForumLanding";
import ForumCategory from "./Pages/ForumCategory";
import ForumThread from "./Pages/ForumThread";
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
        <Link to="/">News </Link>
        <Link to="/events">Community Events </Link>
        {firebaseUser && (
          <>
            <Link to="/post-event">Post Event </Link>
            <Link to="/chat">Chat </Link>
            <Link to="/logout">Logout </Link>
            <Link to="/forum">Forum </Link>
          </>
        )}
        {!firebaseUser && <Link to="/login">Login </Link>}
        <Link to="/contact">Contact </Link>
      </nav>

      {showPopup && (
        <div className="inactivity-popup">
          <p>You have been logged out due to inactivity.</p>
        </div>
      )}

      <Routes>
        <Route path="/" element={<News />} />
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
        <Route path="/contact" element={<ContactForm />} />

        {/* Forum routes - protected */}
        <Route
          path="/forum"
          element={firebaseUser ? <ForumLanding /> : <Login />}
        />
        <Route
          path="/forum/category/:category"
          element={firebaseUser ? <ForumCategory /> : <Login />}
        />
        <Route
          path="/forum/thread/:postId"
          element={firebaseUser ? <ForumThread /> : <Login />}
        />
      </Routes>

    </Router>
  );
};

export default App;
