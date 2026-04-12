# Roadmap

## Phase 0: Basic Setup
- Initial code roughly in place
- Repo structure established
- Add ESLint with JSDoc and Initial Testing 

## Phase 1: Basic Explanation
- CLI Interface
- Input log file
- Send to OpenAI
- Print explanation

## Phase 2: Log Parsing
- Detect stack traces
- Extract key error lines
- Normalize logs

## Phase 3: Smarter AI Prompts
- Context-aware prompts
- Language/framework detection
- Semantic similarities (embeddings)
- LLM-as-a-judge experiments

## Phase 4: CLI Tool
- `npx log-explainer error.log`
- Config-driven
- Turn eslint rules no-console on
- Add logging library such as `winston`

## Phase 5: Advanced Features
- Group similar errors
- Suggest fixes with code snippets
- CI integration for failed builds
- Execute evaluations in GitHub actions
- Regression detection for prompts