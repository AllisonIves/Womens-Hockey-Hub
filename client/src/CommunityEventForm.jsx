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

  const [preview, setPreview] = useState(null);
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

    // Show a preview of the uploaded image
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", eventData.name);
      formData.append("description", eventData.description);
      formData.append("date", eventData.date);
      formData.append("location", eventData.location);
      formData.append("photo", eventData.image); // ✅ Ensure correct field name

      // Send request with `multipart/form-data` header
      await axios.post("http://localhost:5000/api/communityevent", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

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
      setPreview(null);

    } catch (error) {
      console.error("Error submitting event:", error);
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
          {preview && <img src={preview} alt="Preview" width="100" />} {/* ✅ Show preview */}
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
