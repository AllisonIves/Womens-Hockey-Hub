/**
 * @file Defines the Mongoose schema for community-submitted events.
 * These events appear on the Community Events page once approved.
 */

const mongoose = require("mongoose");

/**
 * Schema for community-submitted events displayed in the Community Events page.
 */
const thisSchema = new mongoose.Schema({
    /** Name of the event */
    name: String,

    /** Location where the event takes place */
    location: String,

    /** Date of the event */
    date: Date,

    /** Description of the event */
    description: String,

    /** Only approved events will show on event page */
    isApproved: Boolean,

    /** Name of the person who submitted the event */
    userPosted: String,

    /** Relative path to uploaded event photo (optional) */
    photo: { type: String }

});

module.exports = mongoose.model('Communityevent', thisSchema);