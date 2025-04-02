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