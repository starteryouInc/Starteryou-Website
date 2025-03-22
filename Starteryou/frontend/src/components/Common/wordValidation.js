/**
 * Limits the input value to a maximum number of words.
 * Displays an alert if the word limit is exceeded.
 * @param {string} value - The current value of the input/textarea.
 * @param {number} maxWords - The maximum number of words allowed.
 * @returns {string} - The truncated value.
 */
import { toast } from 'react-hot-toast';

export const MaxWords = (value, maxWords, setCounter) => {
  const words = value.trim().split(/\s+/); // Split by spaces, ignoring extra spaces
  setCounter(maxWords - words.length); // Update the live word counter

  if (words.length > maxWords) {
    toast.error(`Word limit exceeded! Maximum allowed is ${maxWords} words.`);
  }

  return words.length <= maxWords ? value : words.slice(0, maxWords).join(" ");
};
