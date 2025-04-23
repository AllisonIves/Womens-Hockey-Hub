/**
 * Validates that the provided text meets the minimum character requirement of 5 characters.
 *
 * @param {string} text - The text content to validate.
 * @returns {{ isValid: boolean, message: string }} An object indicating validity.
 * If invalid, includes a message explaining the issue.
 */
const replyCharacterMin = (text) => {
    const minChars = 5;
    if (text.trim().length < minChars) {
      return {
        isValid: false,
        message: "Reply must be at least 5 characters long",
      };
    }
    return { isValid: true };
  };
  
  export default replyCharacterMin;