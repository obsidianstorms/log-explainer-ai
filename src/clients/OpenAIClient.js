import OpenAI from "openai";

import Log from "../logger/Log.js";

class OpenAIClient {
  constructor({ apiKey, model = "gpt-4o-mini" } = {}) {
    this.model = model;

    this.client = new OpenAI({
      apiKey: apiKey,
    });

    this.logger = new Log("OpenAIClient");
  }

  async chat({ messages, model, temperature = 0.2, maxTokens = 500 } = {}) {
    const start = Date.now();

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

    this.logger.log({
      provider: "openai",
      model: response.model,
      prompt: messages,
      response,
      latency: Date.now() - start,
      success: response.done === true && response.done_reason === "stop",
    });

    return {
      text: response.choices?.[0]?.message.content,
      raw: response,
    };
  }
}

export default OpenAIClient;
