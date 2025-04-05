const fs = require('fs');
const path = require('path');

const bannedWordsPath = path.join(__dirname, '../bannedWords.json');
const bannedWords = JSON.parse(fs.readFileSync(bannedWordsPath)).bannedWords;

/**
 * Check if a message contains any banned words
 * @param {string} message - The message to check
 * @returns {boolean} - True if it contains a banned word, false otherwise
 */
function containsBannedWord(message) {
  const lowerCaseMessage = message.toLowerCase();
  return bannedWords.some(word => lowerCaseMessage.includes(word));
}

module.exports = containsBannedWord;