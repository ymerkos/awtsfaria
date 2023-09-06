/**
 * B"H
 * service worker
 */
var cacheName = "awtsmoosCash";
console.log("Service")
//caching
self.addEventListener('fetch', (event) => {
    console.log("fetching", event)

    // Skip if request is for the Service Worker itself
    if (event.request.url.includes('/oyvedEdom.js')) {
        console.log("skipping self")
        return;
    }
    event.respondWith(
        caches.match(event.request)
        .then((cachedResponse) => {
            if (cachedResponse) {
            //    console.log("Got cache",cachedResponse)
                return cachedResponse;
            }
            
            // IMPORTANT: Clone the request object
            // A request is a stream and can only be consumed once
            const fetchRequest = event.request.clone();

            return fetch(fetchRequest).then((response) => {
                // Check if the received response is valid
                if (!response || response.status !== 200) {
                    //console.log("basic response", response)
                    return response;
                }

                // IMPORTANT: Clone the response object
                // A response is a stream and because we want the browser
                // to consume the response as well as the cache to consume
                // the response, we need to clone it so we have two streams.
                const responseToCache = response.clone();

                // Cache the response
                caches.open(cacheName)
                .then((cache) => {
                    cache.put(event.request, responseToCache);
                 //   console.log("Cached!",cacheName)
                });

                return response;
            });
        })
    );
});

self.addEventListener('activate', (event) => {
   // console.log("active",event)
    clients.claim();
    event.waitUntil(
        caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cache) => {
            if (cache !== cacheName) {
                return caches.delete(cache);
            }
            })
        );
        })
    );
});