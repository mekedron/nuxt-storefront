<script setup>
const { result: customerNameResult } = useCustomerNameQuery();
</script>

<template>
  <div>
    Full Name: {{ customerNameResult?.customer?.firstname }}
    {{ customerNameResult?.customer?.lastname }}
  </div>
</template>
