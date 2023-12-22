async function cacheThenNetwork(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  return fetch(request);
}

self.addEventListener('fetch', (event) => {
  event.respondWith(cacheThenNetwork(event.request));
});
