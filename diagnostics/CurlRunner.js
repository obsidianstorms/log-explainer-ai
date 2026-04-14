import { spawn } from "child_process";

const SecondsTimeout30sInMs = 30000;
/**
 * A tool to execute and share reproducible curl commands for debugging and diagnostics.
 *
 * This is useful for quickly testing API endpoints and sharing the exact request details with others.
 * It generates a curl command based on the provided URL, headers, and data, and then executes it.

 * Note: This implementation is basic and may not cover all edge cases or curl options.
 */
class CurlRunner {

  lastCommand = "";
  showSecrets = false;
  showCommand = true;
  rawOutput = false;
  failOnHttpFail = false;

  constructor({ 
    showSecrets = false, 
    showCommand = true,
    rawOutput = false,
    failOnHttpFail = false,
  } = {}) {
    this.showSecrets = showSecrets;
    this.showCommand = showCommand;
    this.rawOutput = rawOutput;
    this.failOnHttpFail = failOnHttpFail;
  }

  /**
   * Gets a set of standard arguments for the curl command.
   * Optionally includes:
   *  - --fail-with-body to treat HTTP error responses as failures
   * 
   * @returns [string]
   */
  getStandardArgs() {
    const args = [
      "--silent",
      "--show-error",
      "-X",
    ];

    if (this.failOnHttpFail) {
      return [
        "--fail-with-body",
        ...args,
      ];
    }
    
    // -X must be the last argument option
    return args;
  }

  /**
   * Builds the arguments for the curl command based on the provided configuration.
   * 
   * @param {string|object} param0 
   * @returns [string]
   */
  buildArgs({ method = "GET", url, headers = {}, data }) {
    const args = [
      ...this.getStandardArgs(),
      method.toUpperCase(),
      url,
    ];

    for (const [key, value] of Object.entries(headers)) {
      args.push("-H", `${key}: ${value}`);
    }

    if (data) {
      args.push("-d", JSON.stringify(data));
    }

    return args;
  }

  /**
   * Generates a curl command string based on the provided configuration.
   * 
   * @param {string|object} param0 
   * @returns string
   */
  toCurlCommand({ method = "GET", url, headers = {}, data }) {
    const parts = [
      `curl`,
      ...this.getStandardArgs(),
      method.toUpperCase(),
      `"${url}"`,
    ];

    for (const [key, value] of Object.entries(headers)) {
      parts.push(`-H "${key}: ${value}"`);
    }

    if (data) {
      parts.push(`-d '${JSON.stringify(data).replace(/'/g, "'\\''")}'`);
    }

    return parts.join(" ");
  }

  /**
   * Executes the curl command with the given arguments and returns the output.
   * Runs as a spawned child process
   * Provides timeout and process cleanup to prevent hanging processes
   * 
   * @param {string|object} args 
   * @param {*} param1 
   * @returns {stdout: string, stderr: string, durationMs: number}
   */
  async run(args, { timeoutMs = SecondsTimeout30sInMs } = {}) {
    const start = Date.now();

    const child = spawn("curl", args);

    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");

      // for persistent processes, try force killing
      setTimeout(() => {
        if (!child.killed) {
          child.kill("SIGKILL");
        }
      }, 2000);
    }, timeoutMs);

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    const exitCode = await new Promise((resolve, reject) => {
      child.on("error", reject);
      child.on("close", resolve);
    });

    clearTimeout(timeout);

    if (exitCode !== 0) {
      throw new Error(
        `Curl failed (exit ${exitCode}):\n\n` +
        `Command:\n${this.lastCommand}\n\n` +
        `STDOUT:\n${stdout}\n\n` +
        `STDERR:\n${stderr}\n\n` + 
        `Time to Failure (ms): ${Date.now() - start} ms \n\n`
      );
    }

    return { 
      stdout: this.rawOutput ? stdout : this.tryParseJson(stdout), 
      stderr,
      durationMs: Date.now() - start,
    };
  }

  /**
   * Attempt to parse output as JSON, returning raw string if parsing fails.
   * 
   * @param {*} output 
   * @returns object|string
   */
  tryParseJson(output) {
    try {
      return JSON.parse(output);
    } catch {
      return output;
    }
  }

  /**
   * Optionally redact secrets in the header.
   * Looks for Authorization and X-Api-Key headers
   * 
   * @param {*} headers 
   * @returns 
   */
  redactSecrets(headers) {
    const redacted= { ...headers };

    if (redacted.Authorization && !this.showSecrets) {
      const [scheme, token] = redacted.Authorization.split(" ");
      if (scheme?.toLowerCase() === "bearer" && token) {
        redacted.Authorization = `${scheme} ${token.slice(0, 4)}...${token.slice(-4)}`;
      }
    }

    if (redacted["X-Api-Key"] && !this.showSecrets) {
      const key = redacted["X-Api-Key"];
      redacted["X-Api-Key"] = `${key.slice(0, 4)}...${key.slice(-4)}`;
    }

    return redacted;
  }

  /**
   * Generic method to execute a curl request based on the provided configuration.
   * 
   * @param {string|object} config 
   * @returns Promise<{stdout: string, stderr: string, durationMs: number}>
   */
  request(config) {
    const args = this.buildArgs(config);

    const command = this.toCurlCommand({
      ...config,
      headers: this.redactSecrets(config.headers)
    });
    this.lastCommand = command;

    if (this.showCommand) {
      console.log("[CurlRunner] Generated curl command:");
      console.log(command);
    }

    return this.run(args);
  }

  /**
   * Convenience method for GET requests.
   * 
   * @param {string} url 
   * @param {object} headers 
   * @returns Promise<{stdout: string, stderr: string, durationMs: number}>
   */
  get(url, headers = {}) {
    return this.request({ method: "GET", url, headers });
  }

  /**
   * Convenience method for POST requests.
   * 
   * @param {string} url 
   * @param {object} headers 
   * @param {object} data
   * @returns Promise<{stdout: string, stderr: string, durationMs: number}>
   */
  post(url, headers = {}, data = {}) {
    return this.request({ method: "POST", url, headers, data });
  }
}

export default CurlRunner;
