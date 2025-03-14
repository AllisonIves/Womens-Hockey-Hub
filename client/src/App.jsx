import React from 'react';
import Chat from './Pages/Chat';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
    return (
        <Router>
          <Routes>
            <Route path="/Chat" element={<Chat />} />
          </Routes>
        </Router>
    );
}

export default App;