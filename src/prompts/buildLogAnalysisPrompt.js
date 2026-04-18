function buildLogAnalysisPrompt(log) {
  return {
    system: `
You are a log analysis system.
- Be concise
- Do not guess
- If unsure, say "unknown"
- Output section:
  1. Summary
  2. Likely Cause
  3. Suggested Fix
    `,
    user: log,
  };
}

export default buildLogAnalysisPrompt;
