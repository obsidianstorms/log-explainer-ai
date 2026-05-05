import { client } from "../clients/openaiRunner.js";

/**
 * Explains a log message using the OpenAI API.
 *
 * @param {string} logText - The log message to explain.
 * @returns {Promise<string>} - The explanation of the log message.
 */

export async function explainLog(logText) {
  const prompt = `
You are an expert software engineer.

Explain the following log message clearly and concisely.
Include: 
* The error meaning
* The likely cause
* The suggested fix

Log: 
${logText}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response?.choices?.[0]?.message?.content?.trim() || "No response returned.";
}
