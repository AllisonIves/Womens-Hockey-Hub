// unit testing sortEventsDesc.js

import { sortEventsDesc } from "./sortEvents.js";

// Create a mock array of events with different dates
const mockEvents = [
  { name: "Event A", date: new Date("2024-05-01") },
  { name: "Event B", date: new Date("2024-08-15") },
  { name: "Event C", date: new Date("2024-10-10") }
];

// Expected result (latest to earliest)
const expected = [
  { name: "Event C", date: new Date("2024-10-10") },
  { name: "Event B", date: new Date("2024-08-15") },
  { name: "Event A", date: new Date("2024-05-01") }
];

// Run the sortEventsDesc function
const result = sortEventsDesc(mockEvents);

// Output 
console.log("Test sortEventsDesc (latest to earliest):");
console.log(JSON.stringify(result) === JSON.stringify(expected) ? "PASS" : "FAIL", result);
