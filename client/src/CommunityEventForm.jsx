import React, { useState } from "react";
import axios from "axios";

const CommunityEventForm = () => {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    image: null,
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEventData(prevData => ({
      ...prevData,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate submitting to backend API
      await axios.post('/api/events', eventData);

      // Show confirmation popup
      setShowPopup(true);

      // Reset form
      setEventData({
        name: '',
        description: '',
        date: '',
        location: '',
        image: null,
      });
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  return (
    <div>
      <h2>Submit Community Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name:</label>
          <input type="text" name="name" value={eventData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={eventData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" name="location" value={eventData.location} onChange={handleChange} required />
        </div>
        <div>
          <label>Image (Optional):</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">Submit Event</button>
      </form>

      {showPopup && (
        <div className="popup">
          <p>Your event has been submitted and is under review.</p>
        </div>
      )}
    </div>
  );
};

export default CommunityEventForm;