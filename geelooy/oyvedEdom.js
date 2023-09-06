/**
 * B"H
 * service worker
 */

//caching
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});