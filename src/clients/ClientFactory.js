import dotenv from "dotenv";

import OpenAIClient from "./OpenAIClient.js";
import OpenAIProvider from "./OpenAIProvider.js";
import OllamaClient from "./OllamaClient.js";
import OllamaProvider from "./OllamaProvider.js";

dotenv.config();

function createLLMProvider() {
  if (process.env.LLM_PROVIDER === "openai") {
    return new OpenAIProvider(new OpenAIClient({ apiKey: process.env.OPENAI_API_KEY }));
  }

  return new OllamaProvider(new OllamaClient());
}

export default createLLMProvider;
