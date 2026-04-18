import { fetchToCurl } from "fetch-to-curl";

import { redactSecrets } from "../utils/redactSecrets.js";
import { tryParseJson } from "../utils/tryParseJson.js";

/**
 * A tool to execute NodeJS fetch() with optional Curl Command output for
 * sharing and reproduce-ability for proof-of-concepts, debugging, and diagnostics.
 *
 * This is useful for quickly testing API endpoints and sharing the exact request details with others.
 *
 * Note: This implementation is basic and may not cover all edge cases or fetch options.
 * For example, non-UTF8 encodings, malformed headers, streaming edge cases might behave unexpectedly.
 */
class FetchRunner {
  constructor({ showSecrets = false, showCommand = true, rawOutput = false, failOnHttpFail = false } = {}) {
    this.showSecrets = showSecrets;
    this.showCommand = showCommand;
    this.rawOutput = rawOutput;
    this.failOnHttpFail = failOnHttpFail;

    this.lastCommand = "";
  }

  /**
   * Generates a curl command for the given URL and options.
   *
   * @param {string} url
   * @param {*} options
   * @returns {string} The generated curl command
   */
  toCurlCommand({ url, data: requestData, method = "GET", headers = {} }) {
    const body = requestData && typeof requestData === "object" ? JSON.stringify(requestData) : requestData;
    const safeOptions = {
      method,
      body,
      headers: redactSecrets(headers, { showSecrets: this.showSecrets }),
    };

    const command = fetchToCurl(url, safeOptions);
    this.lastCommand = command;

    if (this.showCommand) {
      console.log("[FetchRunner] Generated curl command:");
      console.log(command);
    }

    return command;
  }

  /**
   * Process and return response data based on content type and configuration.
   *
   * @param {*} response
   * @returns {object|string}
   * @throws Will throw an error if response parsing fails or if failOnHttpFail is true and response is not ok
   */
  async processResponse(response) {
    const contentType = response.headers.get("content-type") || "";

    try {
      const data = await response.text();

      if (this.failOnHttpFail && !response.ok) {
        throw new Error(
          `Fetch failed (${response.status})\n\n` + `Command:\n${this.lastCommand}\n\n` + `Response:\n${data}`,
        );
      }

      if (this.rawOutput) {
        return data;
      }

      if (contentType.toLowerCase().includes("json")) {
        // return response.json(); - to risky alone if json issues
        return tryParseJson(data);
      }

      return data;
    } catch (err) {
      throw new Error(`Failed to parse response\n\nCommand:\n${this.lastCommand}\n\nError: ${err.message}`, {
        cause: err,
      });
    }
  }

  /**
   * Execute a fetch request with the given URL and options, while generating
   * a corresponding curl command for debugging and sharing.
   *
   * @param {*} url
   * @param {*} options
   * @returns {{ status, statusText, headers, data, durationMs, ttfbMs }}
   */
  async request({ url, method, headers, data: requestData }) {
    if (this.showCommand && requestData && !headers?.["Content-Type"]) {
      console.warn("[FetchRunner] Warning: No Content-Type header set for request body.");
    }

    const start = Date.now();

    this.toCurlCommand({ url, method, headers, data: requestData });

    const body = requestData && typeof requestData === "object" ? JSON.stringify(requestData) : requestData;
    const response = await fetch(url, { method, headers, body });

    const ttfbMs = Date.now() - start;

    const processed = await this.processResponse(response);

    const durationMs = Date.now() - start;

    return {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      headers: response.headers,
      url,
      data: processed,
      durationMs,
      ttfbMs,
    };
  }

  /**
   * Convenience method for GET requests.
   *
   * @param {string} url
   * @param {*} headers
   * @returns {Promise<{ status, statusText, headers, data, durationMs, ttfbMs }>}
   */
  get({ url, headers = {} }) {
    return this.request({ url, method: "GET", headers });
  }

  /**
   * Convenience method for POST requests.
   *
   * @param {string} url
   * @param {*} headers
   * @param {*} data
   * @returns {Promise<{ status, statusText, headers, data, durationMs, ttfbMs }>}
   */
  post({ url, headers = {}, data = {} }) {
    return this.request({
      url,
      headers,
      data,
      method: "POST",
    });
  }
}

export default FetchRunner;
