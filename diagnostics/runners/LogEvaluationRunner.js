import cases from "../evaluations/evaluationDatasetCases.js";
import ClientFactory from "../../src/clients/ClientFactory.js";

async function evaluate(client, cases) {
  for (const c of cases) {
    const result = await client.generate({ input: c.log });

    return {
      log: c.log,
      output: result.text,
      expected: c.expected,
    };
  }
}

(async () => {
  const client = new ClientFactory();
  const evaluation = await evaluate(client, cases);
  console.log(evaluation);
})();
