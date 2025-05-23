/**
 * Utility to check user-submitted text against a list of banned words.
 *
 * Loads banned words from `/server/bannedWords.json` and provides a function
 * that returns true if a given message contains any of those words.
 */

const fs = require('fs');
const path = require('path');

const bannedWordsPath = path.join(__dirname, '../bannedWords.json');
const bannedWords = JSON.parse(fs.readFileSync(bannedWordsPath)).bannedWords;

/**
 * Check if a message contains any banned words.
 *
 * @param {string} message - The user-submitted message to check.
 * @returns {boolean} - True if the message contains a banned word, false otherwise.
 */
function containsBannedWord(message) {
  const lowerCaseMessage = message.toLowerCase();
  return bannedWords.some(word => lowerCaseMessage.includes(word));
}

module.exports = containsBannedWord;