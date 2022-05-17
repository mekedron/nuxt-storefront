<script setup>
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

const { signInToken, isSignedIn } = storeToRefs(userStore);
const { signIn, signOut } = userStore;

const { result } = useStoreNameQuery({
  prefetch: true,
});

const { mutate: mutateSignIn } = useSignInMutation({});

const handleSignIn = async () => {
  const { data } = await mutateSignIn({
    email: 'roni_cost@example.com',
    password: 'roni_cost3@example.com',
  });

  if (data.generateCustomerToken.token) {
    await signIn(data.generateCustomerToken.token);
  }
};

const handleSignOut = async () => {
  await signOut();
};
</script>
<template>
  <div>Token: {{ signInToken }}</div>
  <div>Store Code: {{ result?.storeConfig?.store_code }}</div>
  <div>Store Name: {{ result?.storeConfig?.store_name }}</div>

  <CustomerName v-if="isSignedIn" />

  <button @click="handleSignOut" v-if="signInToken">Sign Out</button>
  <button @click="handleSignIn" v-else>Sign In</button>
</template>
