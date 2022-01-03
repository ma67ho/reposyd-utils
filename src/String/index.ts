/**
 * Tests wether the given string is empty or not.
 * @param  {string} str A string to test
 * @returns {boolean} True if the string is null or empty
 * @since 0.1.0
 * @memberof module:Utils/String
 */
 function isEmpty (str: string): boolean {
  return (!str || str.length === 0 || !str.trim())
}

export default {
  isEmpty
}