// unit testing filterApprovedEvents.js

import filterApprovedEvents from "./filterApprovedEvents.js";

// Mock input: a mix of approved and unapproved events
const mockEvents = [
  { name: "Event A", isApproved: true },
  { name: "Event B", isApproved: false },
  { name: "Event C", isApproved: true }
];

// Expected output: only approved events
const expected = [
  { name: "Event A", isApproved: true },
  { name: "Event C", isApproved: true }
];

// Call the function with the mock input
const result = filterApprovedEvents(mockEvents);

// Log the test result
console.log("Test filterApprovedEvents:");
console.log(JSON.stringify(result) === JSON.stringify(expected) ? "PASS" : "FAIL", result);