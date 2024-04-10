/**
 * B"H
 * service worker
 */
var cacheName = "awtsmoosCash-10";
console.log("Service!!")

var cached  = {};
var nm = 0
//caching
self.addEventListener('fetch', (event) => {
    //console.log("fetching", event.request.url)
	var url = event.request.url;
	
	var shouldNotCache = (
        url.includes("oyvedEdom") ||
		url.includes("firebasestorage") || // Do not cache if it's not a Firebase storage asset
		(url.includes("firebasestorage") && url.includes("indexes")) // Do not cache if it's a Firebase storage asset in the "indexes" folder
	);
    if(
		shouldNotCache
	) {
	//	console.log("NOt caching",url)
        return;
    }
    if(event.request.method.toLowerCase() == "post") {
        return;
    }
    event.respondWith(
        caches.match(event.request)
        .then((cachedResponse) => {
            if (cachedResponse) {
             //   console.log("Got cache",cachedResponse)
                cached[Date.now() + "_"+ (nm++)] = cachedResponse
                return cachedResponse;
            }
            
            // IMPORTANT: Clone the request object
            // A request is a stream and can only be consumed once
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then((response) => {
                // Check if the received response is valid
                if (!response || response.status !== 200) {
                   // console.log("responding without cachine")
                    //console.log("basic response", response)
                    return response;
                }

                // IMPORTANT: Clone the response object
                // A response is a stream and because we want the browser
                // to consume the response as well as the cache to consume
                // the response, we need to clone it so we have two streams.
                var responseToCache = response.clone();

                // Cache the response
                caches.open(cacheName)
                .then((cache) => {
                    
                    // Skip if request is for the Service Worker itself
                    if (event.request.url.includes('oyvedEdom.js')) {
                       // console.log("skipping self")
                        return;
                    }
                    if(!shouldNotCache)  {
						console.log("YES caching",url)
                        cache.put(event.request, responseToCache);
                      //  console.log("Cached!",cacheName)
                    } else {
						console.log("No still not cach",url)
					}
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