export const clearCustomerDataFromCache = async client => {
  // Cached data
  client.cache.evict({ id: 'Customer' });
  // Cached ROOT_QUERY
  client.cache.evict({ fieldName: 'customer' });
  client.cache.evict({ fieldName: 'customerWishlistProducts' });
  client.cache.evict({ fieldName: 'dynamicBlocks' });

  client.cache.gc();
};
