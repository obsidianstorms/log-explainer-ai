import ollama from "ollama";

class OllamaClient {
  constructor({ host = "http://localhost:11434", model = "mistral:7b-instruct" } = {}) {
    this.host = host;
    this.model = model;
  }

  async chat({ messages, model } = {}) {
    const response = await ollama.chat({
      host: this.host,
      model: model || this.model,
      messages,
    });

    return {
      text: response.message?.content,
      raw: response,
    };
  }
}

export default OllamaClient;
