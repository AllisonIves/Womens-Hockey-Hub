/**
 * Routes for handling community event submissions and moderation.
 * 
 * Handles:
 * - Creating new events (with optional image upload)
 * - Retrieving all events or a specific one by ID
 * - Approving or deleting events
 * - Updating event details (including optional image update)
 * 
 * Multer is used to store uploaded images in the /uploads folder.
 * Connected controller: ../controllers/communityevent.js
 */

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

/**
 * @route POST /api/communityevent
 * @desc Create a new community event (with optional image upload)
 */
router.post('/', upload.single('photo'), communityeventcon.createEvent);

/**
 * @route GET /api/communityevent
 * @desc Get all community events
 */
router.get('/', communityeventcon.getAllEvents);

/**
 * @route GET /api/communityevent/:id
 * @desc Get a single community event by ID
 */
router.get('/:id', communityeventcon.getEventById);

/**
 * @route DELETE /api/communityevent/:id
 * @desc Delete a community event by ID
 */
router.delete('/:id', communityeventcon.deleteEvent);

/**
 * @route PUT /api/communityevent/:id/approve
 * @desc Approve a community event
 */
router.put('/:id/approve', communityeventcon.approveEvent);

/**
 * @route PUT /api/communityevent/:id
 * @desc Update a community event (optionally with new image)
 */
router.put('/:id', upload.single('photo'), communityeventcon.updateEvent);

/**
 * @route PUT /api/communityevent/approve/:id
 * @desc Approve a community event (we may have made a mistake, this could be duplicate?)
 */
router.put('/approve/:id', communityeventcon.approveEvent);

module.exports = router;


