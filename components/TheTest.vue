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
  <a-layout class="layout">
    <a-layout-header>
      <div class="logo" />
      <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item key="1">nav 1</a-menu-item>
        <a-menu-item key="2">nav 2</a-menu-item>
        <a-menu-item key="3">nav 3</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <div :title="signInToken" :style="{ overflow: 'hidden', textOverflow: 'ellipsis' }">
          Token: {{ signInToken }}
        </div>
        <div>Store Code: {{ result?.storeConfig?.store_code }}</div>
        <div>Store Name: {{ result?.storeConfig?.store_name }}</div>

        <CustomerName v-if="isSignedIn" />

        <a-button type="primary" @click="handleSignOut" v-if="signInToken">
          <a-icon-user-outlined />
          Sign Out
        </a-button>
        <a-button type="primary" @click="handleSignIn" v-else>
          <a-icon-user-outlined />
          Sign In
        </a-button>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>
