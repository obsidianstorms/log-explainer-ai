
import buildLogAnalysisPrompt from "../prompts/buildLogAnalysisPrompt.js";
import safeParse from "../utils/safeParse.js";

class OpenAIProvider {
  constructor(client) {
    this.client = client;
  }

  async generate({ input }) {
    const prompts = buildLogAnalysisPrompt(input);

    const messages = [
      { role: "system", content: prompts.system },
      { role: "user", content: `"Explain this error log and suggest a fix: ${prompts.user}"` },
    ];

    const result = await this.client.chat({ messages });

    return {
      text: result.text,
      json: safeParse(result.text),
      model: "openai",
    };
  }
}

export default OpenAIProvider;
