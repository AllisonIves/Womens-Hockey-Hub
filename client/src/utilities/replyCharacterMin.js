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