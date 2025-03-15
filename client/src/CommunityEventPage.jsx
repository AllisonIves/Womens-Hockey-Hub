
import React, { useEffect, useState } from "react";
import axios from "axios";

const CommunityEventPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/api/events")
      .then((response) => {
        const approvedEvents = response.data
          .filter(event => event.approved)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(approvedEvents);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Community Events</h1>
      {events.length === 0 ? (
        <p>No approved events available.</p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {event.date} at {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Posted by:</strong> {event.poster}</p>
              {event.photo && <img src={event.photo} alt={event.name} className="mt-2 rounded-lg"/>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommunityEventPage;
