import ollama from "ollama";

import Log from "../logger/Log.js";

class OllamaClient {
  constructor({ host = "http://localhost:11434", model = "mistral:7b-instruct" } = {}) {
    this.host = host;
    this.model = model;
    this.logger = new Log("OllamaClient");
  }

  async chat({ messages, model } = {}) {
    const start = Date.now();

    const response = await ollama.chat({
      host: this.host,
      model: model || this.model,
      messages,
    });

    this.logger.log({
      provider: "ollama",
      model: response.model,
      prompt: messages,
      response,
      latency: Date.now() - start,
      success: response.done === true && response.done_reason === "stop",
    });

    return {
      text: response.message?.content,
      raw: response,
    };
  }
}

export default OllamaClient;
