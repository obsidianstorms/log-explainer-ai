/**
 * Interface definition for LLM Providers to the application.
 */
class LLMProvider {
  async generate() {
    throw new Error("Not implemented");
  }
}

export default LLMProvider;
