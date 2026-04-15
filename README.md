# Log Explainer AI

A lightweight Node.js tool using LLMs to analyze and explain application logs, errors, and stack traces.

## Features

- Explain errors and stack traces from provided log files
- Suggest possible fixes
- Works with plain text logs

## Usage

```bash
node src/index.js
```

## Example Output

| This error occurs because...

## Roadmap

See docs/roadmap.md

## Diagnostic Tools

### CurlRunner

A debugging + reproducibility tool for interacting with APIs during exploratory or manual testing phases.

Usage:

```javascript
import { config } from "dotenv";

import CurlRunner from "../diagnostics/CurlRunner.js";

config();

(async () => {
  const runner = new CurlRunner();
  const options = {
    method: "POST",
    url: "https://api.openai.com/v1/responses",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    data: {
      model: "gpt-5-nano",
      input: "write a haiku about ai",
      store: true,
    },
  };

  const { stdout } = await runner.request(options);
  console.log("Response:\n", stdout);
})();
```


### FetchRunner

A tool for building proof-of-concepts and for exploring, debugging, diagnosing, and sharing API requests and their responses.

Usage:

```javascript
import { config } from "dotenv";

import FetchRunner from "../diagnostics/FetchRunner.js";

config();

(async () => {
  const runner = new FetchRunner();
  const options = {
    method: "POST",
    url: "https://api.openai.com/v1/responses",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    data: {
      model: "gpt-5-nano",
      input: "write a haiku about ai",
      store: true,
    },
  };


  const { data } = await runner.request(options);
  console.log("Response:\n", data);
})();
```
