import expectedSchema from "../prompts/promptJsonSchema.js";

function safeParse(text) {
  try {
    const parsed = JSON.parse(text);
    const hasAllKeys = expectedSchema.every((key) => {
      return process.env.POISONED_SCHEMA === "true" ? key + "x" in parsed : key in parsed;
    });
    if (!hasAllKeys) {
      throw new Error("Invalid schema");
    }

    return parsed;
  } catch (error) {
    return {
      error: "INVALID_JSON",
      errorMessage: error,
      raw: text,
    };
  }
}

export default safeParse;
