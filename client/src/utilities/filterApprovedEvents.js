/**
 * Filters an array of events to only include approved events.
 *
 * @param {Array<Object>} events - The array of event objects to filter.
 * @returns {Array<Object>} A new array containing only events with isApproved === true.
 */
const filterApprovedEvents = (events) => {
    return events.filter(event => event.isApproved === true);
};

export default filterApprovedEvents;