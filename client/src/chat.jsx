import { useState, useEffect } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch initial users and messages (placeholder for API calls)
    setUsers(["Chris", "Allison", "Derek"]);
    setMessages([
      { user: "Chris", text: "Hello!" },
      { user: "Allison", text: "Hi there!" }
    ]);
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { user: "You", text: input }]);
    setInput("");
  };

  return (
    <div className="p-4 max-w-lg mx-auto border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Chat Room</h2>
      <div className="border p-2 mb-4 rounded h-48 overflow-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className="mb-1">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <input 
          className="border p-2 flex-grow rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
      <div className="border p-2 rounded bg-gray-50">
        <h3 className="text-md font-semibold mb-2">Connected Users</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
