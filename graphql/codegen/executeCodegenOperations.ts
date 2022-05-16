import { generate, loadContext } from '@graphql-codegen/cli';
import consola from 'consola';
import { existsSync, unlinkSync } from 'fs';

type Operation = 'download-schema' | 'generate-operations' | 'generate-types';

async function processGraphQLCodegenConfig(operation: Operation) {
  const context = await loadContext(`graphql/codegen/${operation}.yml`);
  const xmlConfig = context.getConfig();
  await generate(
    {
      ...xmlConfig,
      ...{
        require: ['dotenv/config'],
      },
    },
    true
  );
}

export async function unlinkGraphQLOperation(graphqlFilePath: string) {
  const tsFile = graphqlFilePath.replace(/^(.*\/)([^.]+)\.graphql/, '$1__generated__/$2.ts');
  if (existsSync(tsFile)) {
    unlinkSync(tsFile);
  }
  consola.success(`Removing "${tsFile}"`)
}

export async function downloadGraphQLSchema() {
  consola.success(`Downloading GraphQL schema...`);
  const start = Date.now();
  try {
    await processGraphQLCodegenConfig('download-schema');
  } catch (exception) {
    consola.error('Cannot download GraphQL schema.');
  }
  const time = Date.now() - start;
  consola.success(`GraphQL schema downloaded in ${time}ms`);
}

export async function generateGraphQLTypes() {
  consola.success(`Generating GraphQL TypeScript type definitions...`);
  const start = Date.now();
  try {
    await processGraphQLCodegenConfig('generate-types');
  } catch (exception) {
    consola.error('Cannot generate GraphQL TypeScript type definitions.');
  }
  const time = Date.now() - start;
  consola.success(`GraphQL TypeScript type definitions generated in ${time}ms`);
}

export async function generateGraphQLOperations() {
  consola.success(`Generating GraphQL TypeScript operations...`);
  const start = Date.now();
  try {
    await processGraphQLCodegenConfig('generate-operations');
  } catch (exception) {
    consola.error('Cannot generate GraphQL TypeScript operations.');
  }
  const time = Date.now() - start;
  consola.success(`GraphQL TypeScript operations generated in ${time}ms`);
}
