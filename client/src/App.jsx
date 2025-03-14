import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Chat from "./Chat.jsx";  // Keep Chat as the only page

const App = () => {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/chat" className="text-blue-600">Chat</Link>
      </nav>
      <Routes>
        <Route path="/chat" element={<Chat />} /> 
      </Routes>
    </Router>
  );
};


export default App;