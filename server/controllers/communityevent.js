const Communityevent = require('../models/communityevent');

// Get All Events
exports.getAllEvents = async (req, res) => {
    try {
        console.log("Fetching all events...");
        const events = await Communityevent.find();
        res.json(events);
    } catch (err) {
        console.error("Error fetching events:", err.message);
        res.status(500).json({ message: "Failed to fetch events", error: err.message });
    }
};

// Get Event by ID
exports.getEventById = async (req, res) => {
    try {
        console.log(`Fetching event with ID: ${req.params.id}`);
        const event = await Communityevent.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (err) {
        console.error("Error fetching event by ID:", err.message);
        res.status(500).json({ message: "Failed to fetch event", error: err.message });
    }
};

// Create Event
exports.createEvent = async (req, res) => {
    try {
        console.log("Received request to create event");
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        // Validate required fields
        if (!req.body.name || !req.body.userPosted || !req.body.date || !req.body.location || !req.body.description) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if user has a pending event
        const checkquantity = await Communityevent.countDocuments({
            userPosted: req.body.userPosted,
            isApproved: false
        });

        if (checkquantity > 0) {
            return res.status(400).json({ message: "You already have an event pending approval." });
        }

        // Handle file upload correctly
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Create new event
        const thisevent = new Communityevent({
            name: req.body.name,
            location: req.body.location,
            date: req.body.date,
            description: req.body.description,
            isApproved: false,
            userPosted: req.body.userPosted,
            photo: imageUrl
        });

        const newEvent = await thisevent.save();
        console.log("Event created successfully:", newEvent);
        res.status(201).json(newEvent);

    } catch (err) {
        console.error("Error creating event:", err.message);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
    try {
        console.log(`Deleting event with ID: ${req.params.id}`);
        const event = await Communityevent.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        console.log("Event deleted successfully");
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error("Error deleting event:", err.message);
        res.status(500).json({ message: "Failed to delete event", error: err.message });
    }
};

// Approve Event
exports.approveEvent = async (req, res) => {
    try {
        console.log(`Approving event with ID: ${req.params.id}`);
        const event = await Communityevent.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        event.isApproved = true;
        await event.save();
        console.log("Event approved successfully");
        res.status(200).json({ message: "Event approved successfully" });
    } catch (err) {
        console.error("Error approving event:", err.message);
        res.status(500).json({ message: "Failed to approve event", error: err.message });
    }
};

// Update Event (Supports Image Updates)
exports.updateEvent = async (req, res) => {
    try {
        console.log(`Updating event with ID: ${req.params.id}`);
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        // Ensure at least one field is provided
        if (!req.body.name && !req.body.location && !req.body.date && !req.body.description && !req.body.userPosted && !req.file) {
            return res.status(400).json({ message: "No update data provided" });
        }

        let updateData = { ...req.body };

        // If an image is uploaded, update it
        if (req.file) {
            updateData.photo = `/uploads/${req.file.filename}`;
        }

        const updatedEvent = await Communityevent.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        console.log("Event updated successfully:", updatedEvent);
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("Error updating event:", error.message);
        res.status(500).json({ message: "Failed to update event", error: error.message });
    }
};

// Approve a specific event
exports.approveEvent = async (req, res) => {
    try {
        const event = await Communityevent.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        event.isApproved = true; // Set isApproved to true
        await event.save();

        res.status(200).json({ message: "Event approved successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Error approving event", error: err.message });
    }
};