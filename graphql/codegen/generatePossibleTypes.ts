import fs from 'fs';
import consola from 'consola';

export default async function generatePossibleTypes() {
  consola.success(`Generating GraphQL possible types JSON...`);
  const start = Date.now();

  const result = await fetch(process.env.GRAPHQL_CODEGEN_SCHEMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      variables: {},
      query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
    }),
  });

  const json = await result.json();

  const possibleTypes = {};

  json.data.__schema.types.forEach((supertype) => {
    if (supertype.possibleTypes) {
      possibleTypes[supertype.name] = supertype.possibleTypes.map((subtype) => subtype.name);
    }
  });

  try {
    fs.mkdirSync('plugins/apolloClient/__generated__', { recursive: true });
  } catch (e) {
    console.log(e.message);
  }

  try {
    fs.writeFileSync(
      'plugins/apolloClient/__generated__/possibleTypes.json',
      JSON.stringify(possibleTypes)
    );
  } catch (err) {
    consola.error('Error writing possibleTypes.json', err);
  }

  const time = Date.now() - start;
  consola.success(`GraphQL possible types JSON generated in ${time}ms`);
}
