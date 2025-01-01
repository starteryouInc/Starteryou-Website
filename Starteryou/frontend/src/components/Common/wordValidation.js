/**
 * Limits the input value to a maximum number of words.
 * Displays an alert if the word limit is exceeded.
 * @param {string} value - The current value of the input/textarea.
 * @param {number} maxWords - The maximum number of words allowed.
 * @returns {string} - The truncated value.
 */
export const MaxWords = (value, maxWords) => {
  const words = value.trim().split(/\s+/); // Split by spaces, ignoring extra spaces

  if (words.length > maxWords) {
    alert(`Word limit exceeded! Maximum allowed is ${maxWords} words.`);
  }

  return words.length <= maxWords ? value : words.slice(0, maxWords).join(" ");
};
