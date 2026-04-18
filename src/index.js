import ClientFactory from "./clients/ClientFactory.js";


const log = `
Error: Cannot read property 'map' of undefined
    at processData (/app/utils.js:42:15)
`;

(async () => {
  const client = ClientFactory();

  const response = await client.generate({ input: log });
  
  console.log("Response:\n", response);
})();
