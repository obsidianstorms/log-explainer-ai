/**
 * Attempt to parse output as JSON, returning raw string if parsing fails.
 *
 * @param {*} output
 * @returns {object|string}
 */
export function tryParseJson(output) {
  try {
    return JSON.parse(output);
  } catch {
    return output;
  }
}
