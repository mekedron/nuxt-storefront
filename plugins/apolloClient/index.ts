import { defineNuxtPlugin } from '#imports';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { provideApolloClient } from '@vue/apollo-composable';
import { getLinks } from '~/plugins/apolloClient/links';
import typePolicies from '~/plugins/apolloClient/typePolicies';
import possibleTypes from '~/plugins/apolloClient/__generated__/possibleTypes.json';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  let graphqlBackendUrl = config.public.graphqlBackendUrl;

  if (!graphqlBackendUrl) {
    graphqlBackendUrl = `http://${
      process.server ? nuxtApp.ssrContext.req.headers.host : window.location.host
    }`;
  }

  const cache = new InMemoryCache({
    possibleTypes,
    // @ts-ignore
    typePolicies,
  });

  let links: Map<string, ApolloLink> = getLinks(
    `${graphqlBackendUrl}${config.public.graphqlBackendPath}`
  );

  const apolloClientOptions = {
    link: ApolloLink.from([...links.values()]),
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
