import React, { useEffect, useState } from "react";
import axios from "axios";

const CommunityEventPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");  // Update the URL based on your backend
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Community Events</h1>
      
      {error && <p className="text-red-500" text-center>{error}</p>}
      {loading ? (
        <p className="text-center text-grey-500">Loading events...</p>
      ) : (
        <ul>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{events.map((event) => (
            <div>
          
            <li key={event.id} className="border p-4 rounded-lg shadow-lg bg-white">
              <h2 className="text-xl font-semibold text-blue-700">{event.name}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p className="nt-2 text-sm text-gray-500"><strong>Date:</strong> {event.date}</p>
              <p className="text-sm text-gray-500"><strong>Location:</strong> {event.location}</p>
            </li>
            </div>
          ))}
          </div>
        </ul>
      )}
    </div>
  );
};

export default CommunityEventPage;
