import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import axios from "axios";

export default function ChatPage() {
  // States for messages and input field
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Fetch messages from the backend on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/messages");
        setMessages(response.data); // Set the messages received from the API
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages(); // Call the function to fetch messages
  }, []);

  // Send message function
  const sendMessage = async () => {
    if (input.trim() !== "") {
      const newMessage = { text: input, sender: "You" };

      // Add the new message to the state
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clear the input field
      setInput("");

      // Send the message to the backend
      try {
        await axios.post("http://localhost:3000/api/messages", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Chat Messages Section */}
      <div className="flex-1 overflow-auto p-4 bg-white rounded-lg shadow-md">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 max-w-xs rounded-lg ${
              msg.sender === "You"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start"
            } flex`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* Chat Input Box */}
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg flex items-center"
          onClick={sendMessage}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
