import FetchRunner from "../../diagnostics/FetchRunner.js";

class OpenAIClient {
  constructor({
    apiKey = process.env.OPENAI_API_KEY,
    model = "gpt-5-nano",
    showSecrets = false,
    failOnHttpFail = false,
    diagnostics,
  } = {}) {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    this.apiKey = apiKey;
    this.model = model;
    this.diagnostics = diagnostics || new FetchRunner({ showSecrets, failOnHttpFail });
  }

  /**
   * Make a request to the OpenAI API to get a response based on the input and options provided.
   *
   * @param {*} param0
   * @returns {Promise<{id: string, model: string, output: any, raw: any, meta: {status: number, ok: boolean, durationMs: number, ttfbMs: number}}>}
   */
  async responses({ input, model, ...rest } = {}) {
    const payload = {
      model: model || this.model,
      input,
      ...rest,
    };

    const result = await this.diagnostics.request({
      method: "POST",
      url: "https://api.openai.com/v1/responses",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      data: payload,
    });

    return this._normalizeResponse(result);
  }

  /**
   * Alias for responses() to provide a more intuitive method name for chat-based interactions.
   *
   * @param {*} input
   * @param {*} options
   * @returns {Promise<{id: string, model: string, output: any, raw: any, meta: {status: number, ok: boolean, durationMs: number, ttfbMs: number}}>}
   */
  async chat(input, options = {}) {
    return this.responses({ input, ...options });
  }

  /**
   * Normalize the response from the OpenAI API to a consistent format for easier consumption by the rest of the application.
   *
   * @param {*} result
   * @returns {{id: string, model: string, output: any, raw: any, meta: {status: number, ok: boolean, durationMs: number, ttfbMs: number}}}
   */
  _normalizeResponse(result) {
    return {
      id: result?.data?.id,
      model: result?.data?.model,
      output: result?.data?.output,
      raw: result?.data,
      meta: {
        status: result?.status,
        ok: result?.ok,
        durationMs: result?.durationMs,
        ttfbMs: result?.ttfbMs,
      },
    };
  }
}

export default OpenAIClient;

// import OpenAI from "openai";
// import { config } from "dotenv";

// config();

// export const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
