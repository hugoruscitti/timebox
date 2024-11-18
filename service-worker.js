/**
 * The cache name should change every time you want to "cache bust"
 * i.e. if you want to change these files
 * in a real-world app this would be handled by your build system
 * e.g. Vite or Next.js would hash the files so the name is unique based on content
 * (style-XYZ123.css etc)
 */
const CACHE_NAME = "mpwa-cache-v1";
const urlsToCache = [
  "/",
  "/estilo.css",
  "/app.js",
  "/index.html",
];

self.addEventListener("install", async (event) => {
  self.skipWaiting();
  event.waitUntil(cache_assets());
});

async function cache_assets() {
  const cache = await self.caches.open(CACHE_NAME);
  return cache.addAll(urlsToCache);
}

self.addEventListener("activate", async (event) => {
  event.waitUntil(delete_old_caches());
});

async function delete_old_caches() {
  const keys = await caches.keys();
  const deletePromises = keys
    .filter((key) => key !== CACHE_NAME)
    .map((key) => self.caches.delete(key));
  return Promise.all(deletePromises);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(get_response(event.request));
});

async function get_response(request) {
  const cache = await self.caches.open(CACHE_NAME);
  const cached_response = await cache.match(request);

  const pending_response = fetch(request).then((response) => {
    cache.put(request, response.clone());
    return response;
  });
  return cached_response || pending_response;
}
