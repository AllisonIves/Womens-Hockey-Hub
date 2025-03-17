const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const communityeventcon = require('../controllers/communityevent');

// Ensure the correct upload folder exists
const uploadPath = path.join(__dirname, '..', 'uploads/');

// Configure Multer (store images in 'server/uploads/' folder)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Store files in 'server/uploads/' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});

const upload = multer({ storage: storage });

// POST - Create a New Event
router.post('/', upload.single('photo'), communityeventcon.createEvent);

// GET all events
router.get('/', communityeventcon.getAllEvents);

// GET single event by ID
router.get('/:id', communityeventcon.getEventById);

// DELETE event
router.delete('/:id', communityeventcon.deleteEvent);

// APPROVE event
router.put('/:id/approve', communityeventcon.approveEvent);

// UPDATE event (supports image update)
router.put('/:id', upload.single('photo'), communityeventcon.updateEvent);

// Approve an Event
router.put('/approve/:id', communityeventcon.approveEvent);

module.exports = router;


