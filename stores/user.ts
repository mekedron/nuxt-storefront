import { acceptHMRUpdate, defineStore } from 'pinia';
import { clearCartDataFromCache } from '~/graphql/cacheControllers/clearCartDataFromCache';
import { useApolloClient } from '@vue/apollo-composable';
import { clearCustomerDataFromCache } from '~/graphql/cacheControllers/clearCustomerDataFromCache';

export const useUserStore = defineStore('user', {
  state: () => ({ signInToken: '' }),
  getters: {
    isSignedIn: (state) => !!state.signInToken,
  },
  actions: {
    async signIn(signInToken: string) {
      this.signInToken = signInToken;
      const { resolveClient } = useApolloClient();
      const apolloClient = resolveClient();
      await clearCartDataFromCache(apolloClient);
      await clearCustomerDataFromCache(apolloClient);
    },
    async signOut() {
      this.signInToken = '';
      const { resolveClient } = useApolloClient();
      const apolloClient = resolveClient();
      await clearCartDataFromCache(apolloClient);
      await clearCustomerDataFromCache(apolloClient);
    },
  },
  persist: true,
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
