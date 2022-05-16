import { defineNuxtPlugin } from '#imports';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { provideApolloClient } from '@vue/apollo-composable';

export default defineNuxtPlugin((nuxtApp) => {
  let graphqlBackendUrl = import.meta.env.STOREFRONT_GRAPHQL_BACKEND_URL;

  if (!graphqlBackendUrl) {
    graphqlBackendUrl = `http://${
      process.server ? nuxtApp.ssrContext.req.headers.host : window.location.host
    }`;
  }

  // HTTP connection to the API
  const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: `${graphqlBackendUrl}${import.meta.env.STOREFRONT_GRAPHQL_BACKEND_PATH}`,
  });

  const cache = new InMemoryCache();

  const apolloClientOptions = {
    link: httpLink,
    cache,
  };

  let apolloClient;

  if (process.server) {
    apolloClient = new ApolloClient(
      Object.assign({}, apolloClientOptions, {
        ssrMode: !!process.server,
      })
    );

    nuxtApp.hook('app:rendered', () => {
      nuxtApp.payload.data['apollo-client'] = apolloClient.extract();
    });
  } else {
    cache.restore(JSON.parse(JSON.stringify(nuxtApp.payload.data['apollo-client'])));

    apolloClient = new ApolloClient(
      Object.assign({}, apolloClientOptions, {
        ssrForceFetchDelay: 100,
      })
    );
  }

  provideApolloClient(apolloClient);

  return {
    provide: {
      apolloClient,
    },
  };
});
