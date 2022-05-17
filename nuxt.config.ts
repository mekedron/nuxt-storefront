import { defineNuxtConfig } from 'nuxt';
import {
  downloadGraphQLSchema,
  generateGraphQLOperations,
  generateGraphQLTypes,
  unlinkGraphQLOperation,
  generatePossibleTypes,
} from './graphql/codegen';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    graphqlBackendProxyTo: 'https://venia.magento.com',

    public: {
      graphqlBackendUrl: '',
      graphqlBackendPath: '/graphql',
    },
  },

  modules: ['@pinia/nuxt'],
  buildDir: '.nuxt-build',
  dev: process.env.NODE_ENV !== 'production',
  debug: process.env.NODE_ENV !== 'production',
  vite: {
    envPrefix: 'CLIENT_',
    build: {
      sourcemap: true, // no effect
    },
  },
  vue: {
    compilerOptions: {
      sourceMap: true, // no effect
    },
  },
  autoImports: {
    dirs: [
      'stores',
      'graphql/fragments/__generated__',
      'graphql/queries/__generated__',
      'graphql/mutations/__generated__',
      'graphql/subscriptions/__generated__',
    ],
  },
  hooks: {
    'build:before': async () => {
      await downloadGraphQLSchema();
      await generateGraphQLTypes();
      await generateGraphQLOperations();
      await generatePossibleTypes();
    },
    'builder:watch': async (event, path) => {
      if (event === 'unlink' && path === 'plugins/apolloClient/__generated__/possibleTypes.json') {
        await downloadGraphQLSchema();
      }

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
        } else if (
          (event === 'change' && path.endsWith('.graphql')) ||
          (event === 'unlink' && path.endsWith('.ts'))
        ) {
          await generateGraphQLOperations();
        }
      }
    },
  },
});
