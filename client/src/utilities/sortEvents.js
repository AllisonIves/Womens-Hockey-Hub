// Sorts an array of events in ascending order (earliest first).
const sortEventsAsc = (events) => {
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Sorts an array of events in descending order (latest first).
const sortEventsDesc = (events) => {
    return [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export { sortEventsAsc, sortEventsDesc };
