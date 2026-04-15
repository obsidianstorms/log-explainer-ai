/**
 * Redacts sensitive information from headers for safe display in generated curl commands.
 * Looks for Authorization and X-Api-Key headers
 *
 * @param {*} headers
 * @param {Object} options
 * @param {boolean} options.showSecrets - Whether to show secrets in the output (default: false)
 * @returns {*}
 */
export function redactSecrets(headers = {}, { showSecrets = false } = {}) {
  const redacted = { ...headers };

  if (redacted.Authorization && !showSecrets) {
    const [scheme, token] = redacted.Authorization.split(" ");
    if (scheme?.toLowerCase() === "bearer" && token) {
      redacted.Authorization = `${scheme} ${token.slice(0, 4)}...${token.slice(-4)}`;
    }
  }

  if (redacted["X-Api-Key"] && !showSecrets) {
    const key = redacted["X-Api-Key"];
    redacted["X-Api-Key"] = `${key.slice(0, 4)}...${key.slice(-4)}`;
  }

  return redacted;
}
