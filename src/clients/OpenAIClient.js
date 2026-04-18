import OpenAI from "openai";

class OpenAIClient {
  constructor({ apiKey, model = "gpt-4o-mini" } = {}) {
    this.model = model;

    this.client = new OpenAI({
      apiKey: apiKey,
    });
  }

  async chat({ messages, model, temperature = 0.2, maxTokens = 500 } = {}) {
    const response = await this.client.chat.completions.create({
      model: model || this.model,
      messages,
      temperature,
      max_tokens: maxTokens,
      // messages: [
      //   system ? { role: "system", content: system } : undefined,
      //   { role: "user", content: prompt }
      // ].filter(Boolean),
    });

    return {
      text: response.choices?.[0]?.message.content,
      raw: response,
    };
  }
}

export default OpenAIClient;
