// unit testing replyCharacterLimit.js

import replyCharacterLimit from "./replyCharacterLimit.js";

// Test case: valid input under limit
const shortReply = "This is a short reply.";
const shortResult = replyCharacterLimit(shortReply);
console.log("Test short reply (under 2500 chars):");
console.log(shortResult.isValid === true ? "PASS" : "FAIL", shortResult);

// Test case: exactly at the limit
const exactReply = "a".repeat(2500);
const exactResult = replyCharacterLimit(exactReply);
console.log("Test exact limit (2500 chars):");
console.log(exactResult.isValid === true ? "PASS" : "FAIL", exactResult);

// Test case: too long
const longReply = "a".repeat(2501);
const longResult = replyCharacterLimit(longReply);
console.log("Test over limit (2501 chars):");
console.log(longResult.isValid === false && longResult.message.includes("2500") ? "PASS" : "FAIL", longResult);
