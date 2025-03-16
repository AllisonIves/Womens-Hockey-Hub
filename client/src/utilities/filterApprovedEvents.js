//Filters an array of events to only include approved events

const filterApprovedEvents = (events) => {
    return events.filter(event => event.isApproved === true);
};

export default filterApprovedEvents;