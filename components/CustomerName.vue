<script setup>

const { result: customerNameResult } = useCustomerNameQuery(() => ({
  prefetch: true,
}));
</script>

<template>
  <div>
      Full Name: {{ customerNameResult?.customer?.firstname }}
      {{ customerNameResult?.customer?.lastname }}
  </div>
</template>
