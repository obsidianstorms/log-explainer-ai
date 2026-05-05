import buildLogAnalysisPrompt from "../prompts/buildLogAnalysisPrompt.js";
import safeParse from "../utils/safeParse.js";
import Log from "../logger/Log.js";

class OpenAIProvider {
  constructor(client) {
    this.client = client;
    this.logger = new Log("OpenAIProvider");
  }

  async generate({ input }) {
    const start = Date.now();
    const prompts = buildLogAnalysisPrompt(input);

    const messages = [
      { role: "system", content: prompts.system },
      { role: "user", content: `"Explain this error log and suggest a fix: ${prompts.user}"` },
    ];

    const result = await this.client.chat({ messages });

    this.logger.log({
      provider: "openai",
      prompt: messages,
      result,
      latency: Date.now() - start,
    });

    return {
      text: result.text,
      json: safeParse(result.text),
      model: "openai",
    };
  }
}

export default OpenAIProvider;
