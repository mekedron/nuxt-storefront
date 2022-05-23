import Components from 'unplugin-vue-components/vite';
import { defineNuxtConfig } from 'nuxt';
import {
  downloadGraphQLSchema,
  generateGraphQLOperations,
  generateGraphQLTypes,
  unlinkGraphQLOperation,
  generatePossibleTypes,
} from './graphql/codegen';
import { AntdComponentResolver } from './vite/AntdComponentResolver';

const lifecycle = process.env.npm_lifecycle_event;

export default defineNuxtConfig({
  // environment configuration
  runtimeConfig: {
    graphqlBackendProxyTo: 'https://app.nuxt-storefront.test',

    public: {
      graphqlBackendUrl: '',
      graphqlBackendPath: '/graphql',
    },
  },

  // meta tags
  meta: {
    meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
  },

  components: true,

  // css
  css: ['~/assets/scss/index.scss'],

  // modules
  modules: ['@pinia/nuxt'],

  // build dir (we need to change it because default .nuxt dir is ignored in WebStorm and cannot be unmarked as ignored)
  buildDir: '.nuxt-build',

  // building config
  build: {
    transpile:
      lifecycle === 'build' || lifecycle === 'generate'
        ? ['ant-design-vue', '@apollo/client', '@vue/apollo-composable']
        : [],
  },

  // bundling
  vite: {
    envPrefix: 'CLIENT_',
    optimizeDeps: {
      esbuildOptions: {
        treeShaking: true,
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      Components({
        resolvers: [AntdComponentResolver()],
      }),
    ],
  },

  // auto imports
  autoImports: {
    dirs: [
      'stores',
      'graphql/fragments/__generated__',
      'graphql/queries/__generated__',
      'graphql/mutations/__generated__',
      'graphql/subscriptions/__generated__',
    ],
  },

  // hooks
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
