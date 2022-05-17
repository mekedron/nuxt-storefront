export const clearCartDataFromCache = async client => {
  // Cached data
  client.cache.evict({ id: 'Cart' });
  // Cached ROOT_QUERY
  client.cache.evict({ fieldName: 'cart' });
  client.cache.evict({ fieldName: 'customerCart' });

  client.cache.gc();
};
