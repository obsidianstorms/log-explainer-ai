import buildLogAnalysisPrompt from "../prompts/buildLogAnalysisPrompt.js";
import safeParse from "../utils/safeParse.js";
import Log from "../logger/Log.js";

class OllamaProvider {
  constructor(client) {
    this.client = client;
    this.logger = new Log("OllamaProvider");
  }

  async _sendPrompt({ input }) {
    const start = Date.now();
    const prompts = buildLogAnalysisPrompt(input);

    const messages = [
      { role: "system", content: prompts.system },
      { role: "user", content: `"Explain this error log and suggest a fix: ${prompts.user}"` },
    ];

    const result = await this.client.chat({ messages });

    this.logger.log({
      provider: "ollama",
      prompt: messages,
      result,
      latency: Date.now() - start,
    });

    return {
      text: result.text,
      json: safeParse(result.text),
      model: "ollama",
    };
  }

  async generate({ input, retries = 0 } = {}, attempts = 0) {
    this.logger.log({
      provider: "ollama",
      method: "generate",
      retries,
      attempts,
    });

    const response = await this._sendPrompt({ input });

    if (response?.json?.error === "INVALID_JSON" && attempts < retries) {
      this.logger.log({
        provider: "ollama",
        method: "generate",
        error: response.json.error,
        message: `Detected Error: ${response.json.errorMessage}`,
      });
      return this.generate({ input, retries }, attempts + 1);
    }

    return response;
  }
}

export default OllamaProvider;
