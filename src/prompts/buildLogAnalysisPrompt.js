import responseSchema from "./promptJsonSchema.js";

function transformSchemaToPrompt(schema = []) {
  let prompt = "";
  for (const [
    index,
    value,
  ] of schema.entries()) {
    prompt += `  ${index + 1}. ${value}`;
  }

  return prompt;
}

function buildLogAnalysisPrompt(log) {
  return {
    system: `
You are a log analysis system.
- Be concise
- Do not guess
- If unsure, say "unknown"
- Output format: JSON
- Output section:
${transformSchemaToPrompt(responseSchema)}
    `,
    user: log,
  };
}

export default buildLogAnalysisPrompt;
