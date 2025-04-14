import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
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

/**
 * App component sets up routing, navigation, authentication state, and session-based
 * access control for the Women's Hockey Hub application.
 *
 * Features:
 * - Uses Firebase for login and session tracking
 * - Automatically logs users out after 30 minutes of inactivity (clicks & navigation)
 * - Displays routes conditionally based on email verification status
 * - Shows a popup on inactivity logout
 *
 * @component
 * @returns {JSX.Element} The root-level layout and router structure for the app.
 */
const App = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

   /**
   * Listens for Firebase auth state changes and updates session storage + user state.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setFirebaseUser(user);
        sessionStorage.setItem("emailVerified", "true");
        sessionStorage.setItem("displayName", user.displayName || "Anonymous");
      } else {
        setFirebaseUser(null);
        sessionStorage.setItem("emailVerified", "false");
        sessionStorage.removeItem("displayName");
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Tracks user inactivity via click and navigation events.
   * Logs out after 30 minutes and displays a popup.
   */
  useEffect(() => {
    let timeout;

    const logoutForInactivity = async () => {
      console.log("Logging out due to inactivity");
      await signOut(auth);
      sessionStorage.setItem("emailVerified", "false");
      sessionStorage.removeItem("displayName");
      setFirebaseUser(null);
      setShowPopup(true);
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logoutForInactivity, 2 * 60 * 1000); // 30 mins
    };

    window.addEventListener("click", resetTimer);
    window.addEventListener("popstate", resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("popstate", resetTimer);
    };
  }, []);

  return (
    <Router>
      <div className="layout-container">
        <nav className="navbar">
          <NavLink to="/" className="nav-link" activeclassname="active">News</NavLink>
          <NavLink to="/events" className="nav-link" activeclassname="active">Community Events</NavLink>
          {firebaseUser ? (
            <>
              <NavLink to="/post-event" className="nav-link" activeclassname="active">Post Event</NavLink>
              <NavLink to="/chat" className="nav-link" activeclassname="active">Chat</NavLink>
              <NavLink to="/logout" className="nav-link" activeclassname="active">Logout</NavLink>
              <NavLink to="/forum" className="nav-link" activeclassname="active">Forum</NavLink>
            </>
          ) : (
            <NavLink to="/login" className="nav-link" activeclassname="active">Login</NavLink>
          )}
          <NavLink to="/contact" className="nav-link" activeclassname="active">Contact</NavLink>
        </nav>

        {showPopup && (
          <div className="inactivity-popup">
            <p>You have been logged out due to inactivity.</p>
          </div>
        )}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<News />} />
            <Route path="/events" element={<CommunityEventPage />} />
            <Route path="/post-event" element={firebaseUser ? <CommunityEventForm /> : <Login />} />
            <Route path="/chat" element={firebaseUser ? <Chat /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/forum" element={firebaseUser ? <ForumLanding /> : <Login />} />
            <Route path="/forum/category/:category" element={firebaseUser ? <ForumCategory /> : <Login />} />
            <Route path="/forum/thread/:postId" element={firebaseUser ? <ForumThread /> : <Login />} />
          </Routes>
        </main>

        <footer className="whh-footer">
          Copyright &copy; Women's Hockey Hub COMP231 Sec401 Group 3
        </footer>
      </div>
    </Router>
  );
};

export default App;
