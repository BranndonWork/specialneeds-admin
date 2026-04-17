// // ./public/sw/cache.js
// importScripts("/sw/chunkCacheManager.js");
// importScripts("/sw/imageCacheManager.js");

// const chunkCacheManager = new self.ChunkCacheManager();
// const imageCacheManager = new self.ImageCacheManager();

// // Handle fetch event
// self.addEventListener("fetch", (event) => {
//   if (chunkCacheManager.handleRequest(event)) return;
//   if (imageCacheManager.handleRequest(event)) return;
//   event.respondWith(fetch(event.request));
// });

// self.addEventListener("fetch", (event) => {
//   const { url } = event.request;

//   // Ignore non-GET requests and requests to other domains
//   if (event.request.method !== "GET" || url.startsWith(self.location.origin)) {
//     event.respondWith(fetch(event.request));
//     return;
//   }

//   const getResponse = async () => {
//     console.log("[cache] // Try to get the response from the custom cache");

//     fetch(`/api/cache?key=${url}`)
//       .then((response) => response.json())
//       .then((cachedResponse) => {
//         if (cachedResponse) {
//           // If found in cache, return the cached response
//           console.log("[cache] // If found in cache, return the cached response");
//           return new Response(cachedResponse);
//         } else {
//           // If not found in cache, fetch from the network
//           console.log("[cache] // If not found in cache, fetch from the network");
//           return fetch(event.request)
//             .then((networkResponse) => {
//               // Cache the network response
//               console.log("[cache] // Cache the network response");
//               fetch("/api/cache", {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                   key: url,
//                   value: networkResponse.clone().text(),
//                 }),
//               });

//               return networkResponse;
//             })
//             .catch((error) => {
//               // Handle any network errors
//               console.log("[cache] // Handle any network errors");
//               console.error("Network error:", error);
//             });
//         }
//       })
//       .catch((error) => {
//         // Handle any errors in the cacheing process
//         console.log("[cache] // Handle any errors in the cacheing process");
//         console.error("Cacheing error:", error);
//       });
//   };

//   event.respondWith(getResponse());
// });

// // Handle precaching
// // self.addEventListener("message", (event) => {
// //   console.log("CACHE EVENT LISTENER", event.data);
// //   if (event.data.type === "cache-pages") {
// //     console.log("Precaching pages", event.data.payload);
// //     const { urls } = event.data.payload;
// //     console.log("Precaching pages", {
// //       urls,
// //       data: event.data,
// //       payload: event.data.payload,
// //     });
// //     caches.open("page-cache").then((cache) => {
// //       urls.forEach((url) => {
// //         console.log("Preparing to precache", url);
// //         fetch(url, { mode: "no-cors" }).then((response) => {
// //           console.log("Precaching", url, response);
// //           cache.put(url, response);
// //         });
// //       });
// //     });
// //   } else if (event.data.action === "clearCache") {
// //     const { cacheName } = event.data;
// //     // if no cache name, clear all caches
// //     if (!cacheName) {
// //       caches.keys().then((cacheNames) => {
// //         return Promise.all(
// //           cacheNames.map((cacheName) => {
// //             return caches.delete(cacheName);
// //           })
// //         );
// //       });
// //     } else {
// //       caches.delete(cacheName);
// //     }
// //   }
// // });
