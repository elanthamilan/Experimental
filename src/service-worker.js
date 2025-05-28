/* eslint-disable no-restricted-globals */
// src/service-worker.js

// This is needed by Workbox to inject the precache manifest.
// If you're not using Workbox precaching, you can still leave this here
// and Workbox will simply inject an empty array.
// For a minimal custom service worker that doesn't use precaching,
// assigning to a variable like this satisfies the build requirement.
// eslint-disable-next-line no-unused-vars
const ignored = self.__WB_MANIFEST;

console.log('Service Worker hitting.');

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
});

self.addEventListener('fetch', (event) => {
  // Basic network-first caching strategy (can be expanded later)
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
