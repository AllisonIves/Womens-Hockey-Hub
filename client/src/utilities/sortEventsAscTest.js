// unit testing sortEventsAsc.js

// Mock input: unordered events
const mockEvents = [
  { name: "Event C", date: new Date("2024-10-10") },
  { name: "Event A", date: new Date("2024-05-01") },
  { name: "Event B", date: new Date("2024-08-15") }
];

// Expected output: sorted events
const expected = [
  { name: "Event A", date: new Date("2024-05-01") },
  { name: "Event B", date: new Date("2024-08-15") },
  { name: "Event C", date: new Date("2024-10-10") }
];

// Run function
const result = sortEventsAsc(mockEvents);

// Compare result to expected
const isSortedCorrectly = result.length === expected.length &&
  result.every((event, i) =>
    event.name === expected[i].name &&
    new Date(event.date).toISOString() === expected[i].date.toISOString()
  );

// Output
console.log("Test sortEventsAsc (earliest to latest):");
if (isSortedCorrectly) {
  console.log("PASS");
} else {
  console.log("FAIL");
}
console.log(result);