// // ./public/sw/baseCacheManager.js

// class BaseCacheManager {
//   constructor(cacheName, requestPath) {
//     this.cacheName = cacheName;
//     this.requestPath = requestPath;
//   }

//   isRequest(url) {
//     return url.pathname.startsWith(this.requestPath);
//   }

//   handleRequest(event) {
//     const { request } = event;
//     const url = new URL(request.url);
//     if (this.isRequest(url)) {
//       event.respondWith(this.handleCache(request));
//       return true;
//     }
//     return false;
//   }

//   async handleCache(request) {
//     const cache = await caches.open(this.cacheName);
//     const response = await cache.match(request);
//     if (response) console.log(`${this.cacheName} cache hit`, request.url);
//     return (
//       response ||
//       fetch(request).then((networkResponse) => {
//         console.log(`${this.cacheName} cache miss`, request.url);
//         cache.put(request, networkResponse.clone());
//         return networkResponse;
//       })
//     );
//   }
// }

// self.BaseCacheManager = BaseCacheManager;
