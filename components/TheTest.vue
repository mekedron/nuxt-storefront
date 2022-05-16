<script setup>
const { result } = useStoreNameQuery({
  prefetch: true,
});
</script>
<template>
  <div>Test: {{ result?.storeConfig?.store_name }}</div>
</template>
