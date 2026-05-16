import { files, version, prerendered } from "$service-worker";

const STATIC_CACHE = `static-cache-v${version}`;

const resources = [...files, ...prerendered];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(resources)),
    ]).then(self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim(),
    caches
      .keys()
      .then((keys) => {
        const CACHE_LIST = [STATIC_CACHE];

        return Promise.all(
          keys
            .filter((key) => !CACHE_LIST.includes(key))
            .map((key) => caches.delete(key)),
        );
      })
      .then(self.skipWaiting()),
  );
});

// self.addEventListener("fetch", (evt) => {
//   const request = evt.request;

//   evt.respondWith(
//     fetch(request)
//       .then((fetchResponse) => {
//         return fetchResponse;
//       })
//       .catch(() => {
//         if (request.url.indexOf(".html") > -1) {
//           return caches.match("/offline");
//         }
//       }),
//   );
// });
