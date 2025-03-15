import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import react, {useState} from "react";
import CommunityEventPage from "./CommunityEventPage"; 
import CommunityEventForm from "./CommunityEventForm.jsx";  
import Chat from "./Chat.jsx";  
const App = () => {
  const [view, setView] = useState("list");

  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/events" className="text-blue-600">Community Events</Link>
        <Link to="/post-event" className="text-blue-600">Post Event</Link>
        <Link to="/chat" className="text-blue-600">Chat</Link>
      </nav>
      <Routes>
        <Route path="/events" element={<CommunityEventPage />} />
        <Route path="/post-event" element={<CommunityEventForm onEventSubmit={() => setView("list")} />} />
        <Route path="/chat" element={<Chat />} /> 
      </Routes>
    </Router>
  );
};


export default App;