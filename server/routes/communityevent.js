const express = require('express');
const router = require('Router');
communityeventcon = require('../controllers/communityevent')
router.get('/', communityeventcon.getAllEvents);
router.get('/:id', communityeventcon.getAllEventsById);
router.create('/:id', communityeventcon.createEvent);
router.delete('/id', communityeventcon.deleteEvent);
router.put('/id', communityeventcon.approveEvent);