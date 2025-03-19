import React, { useState } from "react";
import axios from "axios";
import "/src/styles/CommunityEventForm.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CommunityEventForm = () => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    photo: null,
    userPosted: "",
  });

  const [preview, setPreview] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setEventData((prevData) => ({
      ...prevData,
      photo: file,
    }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("name", eventData.name);
      formData.append("description", eventData.description);
      formData.append("date", eventData.date);
      formData.append("location", eventData.location);
      formData.append("photo", eventData.photo);
      formData.append("userPosted", eventData.userPosted);

      console.log("Submitting form with:", Object.fromEntries(formData.entries())); // Debugging

      const response = await axios.post(`${API_URL}/api/communityevent`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API Response:", response); // Debug API response

      if (response.status === 201) {
        setShowPopup(true);
        setEventData({ name: "", description: "", date: "", location: "", photo: null, userPosted: "" });
        setPreview(null);
      } else {
        throw new Error(`Unexpected response status: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error submitting event:", error.response ? error.response.data : error.message);
      setErrorMessage(`Failed to submit event: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div className="event-form-container">
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
          {preview && <img src={preview} alt="Preview" className="image-preview" />}
        </div>
        <div>
          <label>Your Name:</label>
          <input
            type="text"
            name="userPosted"
            value={eventData.userPosted}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
