/**
 * Validates that the provided text does not exceed the 2500 character limit.
 *
 * @param {string} text - The text content to validate.
 * @returns {{ isValid: boolean, message: string }} An object indicating validity.
 * If invalid, includes a message explaining the issue.
 */

const replyCharacterLimit = (text) => {
    const maxChars = 2500;
    if (text.length > maxChars) {
      return {
        isValid: false,
        message: "Character limit exceeded, max 2500 characters",
      };
    }
    return { isValid: true };
  };
  
  export default replyCharacterLimit;