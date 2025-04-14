/**
 * Sorts an array of events by date in ascending order (earliest first).
 *
 * @param {Array<{ date: string }>} events - The array of event objects to sort.
 * @returns {Array<{ date: string }>} A new array sorted by earliest event date first.
 */

const sortEventsAsc = (events) => {
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Sorts an array of events by date in descending order (latest first).
 *
 * @param {Array<{ date: string }>} events - The array of event objects to sort.
 * @returns {Array<{ date: string }>} A new array sorted by latest event date first.
 */
const sortEventsDesc = (events) => {
    return [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export { sortEventsAsc, sortEventsDesc };
