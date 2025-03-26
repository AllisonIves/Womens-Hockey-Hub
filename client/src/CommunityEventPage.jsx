import React, { useEffect, useState } from "react";
import axios from "axios";
import { sortEventsAsc, sortEventsDesc } from "./utilities/sortEvents"; 
import filterApprovedEvents from "./utilities/filterApprovedEvents";
import "/src/styles/CommunityEventPage.css";

const CommunityEventPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  const [openDropdown, setOpenDropdown] = useState(null); //Track if dropdown is open
  
  const toggleDropdown = (eventId) => {
    if (openDropdown === eventId) {
      setOpenDropdown(null); //Close if clicked again
    } else {
      setOpenDropdown(eventId); //Open dropdown for the event
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/communityevent");
            const approvedEvents = filterApprovedEvents(response.data);
            setEvents(approvedEvents);
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
    <div className="events-container">
      <h1 className="events-title">Community Events</h1>

      {/* Sorting Buttons */}
      <div className="sorting-buttons">
        <button onClick={() => setEvents(sortEventsAsc(events))} className="sort-button">
          Sort Ascending
        </button>
        <button onClick={() => setEvents(sortEventsDesc(events))} className="sort-button">
          Sort Descending
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className="loading-message">Loading events...</p>
      ) : (
        <div className="event-list-container">
          <ul className="event-list">
            {events.map((event) => (
              <li key={event._id} className="event-card">
                {event.photo && (
                  <img
                    src={`http://localhost:5000${event.photo}`}
                    alt={event.name}
                    className="event-image"
                  />
                )}
                <h2 className="event-name">{event.name}</h2>
                <p className="event-description">{event.description}</p>
                <p className="event-details"><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
                <p className="event-details"><strong>Location:</strong> {event.location}</p>
                
                 {/* Share Button */}
                <button
                  onClick={() => toggleDropdown(event._id)}
                  className="share-button"
                >
                Share
                </button>
                
            {/* Dropdown menu */}
            {openDropdown === event._id && (
              <div className="dropdown-menu">
                {/* X Share */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    event.name
                  )}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dropdown-item x"
                >
                  Share on X
                </a>

                {/* Facebook Share */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dropdown-item facebook"
                >
                  Share on Facebook
                </a>
              </div>
            )}
            </li>
               
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default CommunityEventPage;
