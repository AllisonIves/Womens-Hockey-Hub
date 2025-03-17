var mongoose = require("mongoose");

var thisSchema = new mongoose.Schema({
    name: String,
    location: String,
    date: Date,
    description: String,
    isApproved: Boolean,
    userPosted: String,
    photo: { type: String }

});

module.exports = mongoose.model('Communityevent', thisSchema);