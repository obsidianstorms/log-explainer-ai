import { describe, it, expect } from "vitest";
import { explainLog } from "../src/services/explainLog.js";
import { config } from "dotenv";

config();

describe("explainLog", async () => {
  it("returns a response for a basic error", async () => {
    const log = "typeError: undefined is not a function";
    const result = await explainLog(log);

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });
});