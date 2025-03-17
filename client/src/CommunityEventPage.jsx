import React, { useEffect, useState } from "react";
import axios from "axios";
import { sortEventsAsc, sortEventsDesc } from "./utilities/sortEvents"; 
import filterApprovedEvents from "./utilities/filterApprovedEvents";


const CommunityEventPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/communityevent"); // ✅ Updated URL
            const approvedEvents = filterApprovedEvents(response.data); // ✅ Apply the filter
            setEvents(approvedEvents); // Only set approved events
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
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
        Community Events
      </h1>

      {/* Sorting Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setEvents(sortEventsAsc(events))} className="bg-blue-500 text-white p-2 rounded">
          Sort Ascending
        </button>
        <button onClick={() => setEvents(sortEventsDesc(events))} className="bg-green-500 text-white p-2 rounded">
          Sort Descending
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <li key={event._id} className="border p-4 rounded-lg shadow-lg bg-white">
              {event.photo && (
                <img
                  src={`http://localhost:5000${event.photo}`}
                  alt={event.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h2 className="text-xl font-semibold text-blue-700">{event.name}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500"><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
              <p className="text-sm text-gray-500"><strong>Location:</strong> {event.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommunityEventPage;
