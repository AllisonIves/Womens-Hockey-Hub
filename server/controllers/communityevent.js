const Communityevent = require('../models/communityevent')

exports.getAllEvents = async(req, res) => {
    try{
        const Events = await Communityevent.find();
        res.json(Events);
    }
    catch(err)
    {
        res.status(500).json({message: "This didnt go through"});
    }
}


exports.getAllEventsById = async(req, res) => {
    try{
        const Events = await Communityevent.find(req.params.id);
    }
    catch(err)
    {
        res.status(500).json({message: "This didnt go through"});
    }
}

exports.createEvent = async(req, res) => {
    const checkquantity = Community.count({name: "Chris", isApproved: false});
    if (checkquantity == 0)
    {
    const thisevent = new Communityevent({
        name: req.body.name,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description,
        isApproved: false,
        userPosted: req.body.userPosted,
        photo: req.body.photo
    });

    if (checkquantity > 0)
    {
        res.status(500).json({message: "You already made an event. Wait for it to be approved"});
    }

    try{
        const newevent = await Communityevent.save();
        res.status(201).json(newevent);
    }
    catch{
        res.status(500).json({message: "This didnt go through"});
    }
}

exports.deleteEvent = async(req, res) => {
    const event = await Communityevent.findByIdAndDelete(req.params.id);

}

exports.approveEvent = async(req, res) => {
    const event = await Communityevent.findById(req.params.id);
    event.isApproved = true;
}}