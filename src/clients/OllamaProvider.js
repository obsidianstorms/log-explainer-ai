class OllamaProvider {
  constructor(client) {
    this.client = client;
  }

  async generate({ input }) {
    const messages = [
      // { role: "system", content: "Explain logs clearly" },
      // { role: "user", content: input },
      { role: "system", content: "You are a helpful senior engineer debugging logs" },
      { role: "user", content: `"Explain this error log and suggest a fix: ${input}"` },
    ];

    const result = await this.client.chat({ messages });

    return {
      text: result.text,
      model: "ollama",
    };
  }
}

export default OllamaProvider;
