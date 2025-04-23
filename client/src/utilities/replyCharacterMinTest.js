// unit testing replyCharacterMin.js

import replyCharacterMin from "./replyCharacterMin.js";

// Test case: short reply (too short, below 5 characters)
const tooShortReply = "Hi";
const result1 = replyCharacterMin(tooShortReply);

// Test case: exact minimum (5 characters)
const minLengthReply = "Hello";
const result2 = replyCharacterMin(minLengthReply);

// Test case: longer valid reply
const longEnoughReply = "This is a valid reply.";
const result3 = replyCharacterMin(longEnoughReply);

// Display test results
console.log("Test too short reply (under 5 chars):");
console.log(result1.isValid === false && result1.message ? "PASS" : "FAIL", result1);

console.log("Test exact minimum (5 chars):");
console.log(result2.isValid === true ? "PASS" : "FAIL", result2);

console.log("Test long enough reply:");
console.log(result3.isValid === true ? "PASS" : "FAIL", result3);