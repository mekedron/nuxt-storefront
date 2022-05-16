import { defineNuxtConfig } from 'nuxt';
import {
  downloadGraphQLSchema,
  generateGraphQLOperations,
  generateGraphQLTypes,
  unlinkGraphQLOperation,
} from './graphql/codegen';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  buildDir: '.nuxt-build',
  dev: process.env.NODE_ENV !== 'production',
  vite: {
    envPrefix: 'STOREFRONT_',
  },
  autoImports: {
    dirs: [
      'graphql/fragments/__generated__',
      'graphql/queries/__generated__',
      'graphql/mutations/__generated__',
      'graphql/subscriptions/__generated__',
    ],
  },
  hooks: {
    'build:before': async (event, path) => {
      await downloadGraphQLSchema();
      await generateGraphQLTypes();
      await generateGraphQLOperations();
    },
    'builder:watch': async (event, path) => {
      if (event === 'unlink' && path === 'graphql/remote-schema.graphql') {
        await downloadGraphQLSchema();
      }

      if (
        (event === 'unlink' && path.endsWith('types/__generated__/schema.d.ts')) ||
        path.endsWith('.graphql')
      ) {
        await generateGraphQLTypes();
      }

      if (
        path.startsWith('graphql/fragments') ||
        path.startsWith('graphql/queries') ||
        path.startsWith('graphql/mutations') ||
        path.startsWith('graphql/subscriptions')
      ) {
        if (event === 'unlink' && path.endsWith('.graphql')) {
          await unlinkGraphQLOperation(path);
        } else {
          await generateGraphQLOperations();
        }
      }
    },
  },
});
