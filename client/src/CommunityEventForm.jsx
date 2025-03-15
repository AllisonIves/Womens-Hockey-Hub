import React, { useState } from "react";
import axios from "axios";

const CommunityEventForm = ({ onEventSubmit }) => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    poster: "",
    photo: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

 
  const handleFileChange = (e) => {
    setEventData({ ...eventData, photo: e.target.files[0] });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.keys(eventData).forEach((key) => {
        formData.append(key, eventData[key]);
      });

      await axios.post("/api/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        onEventSubmit();
      }, 2000);
    } catch (error) {
      console.error("Error submitting event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">Create Community Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Event Name" onChange={handleChange} required className="border p-2 w-full"/>
        <textarea name="description" placeholder="Event Description" onChange={handleChange} required className="border p-2 w-full"/>
        <input type="date" name="date" onChange={handleChange} required className="border p-2 w-full"/>
        <input type="time" name="time" onChange={handleChange} required className="border p-2 w-full"/>
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required className="border p-2 w-full"/>
        <input type="text" name="poster" placeholder="Your Name" onChange={handleChange} required className="border p-2 w-full"/>
        <input type="file" name="photo" onChange={handleFileChange} className="border p-2 w-full"/>
        <button type="submit" disabled={isSubmitting} className="bg-green-500 text-white px-4 py-2 rounded">
          Submit Event
        </button>
      </form>

      
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-lg">Community event is under review!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityEventForm;
