
/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { NetworkFirst } from 'workbox-strategies';
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-functions-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-storage-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-database-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-performance-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-remote-config-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')) {
      return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Return true to signal that we want to use the handler.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// Example of runtime caching route with NetworkFirst strategy
registerRoute(
  ({ url }) => url.origin === 'https://fakestoreapi.com' && url.pathname.startsWith('/products'),
  new NetworkFirst({
    cacheName: 'products-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);

// Register route for specific category using NetworkFirst strategy
registerRoute(
  ({ url }) => url.origin === 'https://fakestoreapi.com' && url.pathname.startsWith('/products/category/jewelery'),
  new NetworkFirst({
    cacheName: 'category-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Add detailed logging for fetch events
self.addEventListener('fetch', (event) => {
  console.log('Fetch event for:', event.request.url);
  if (event.request.url.includes("fakestoreapi.com")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }
        console.log('Fetching from network:', event.request.url);
        return fetch(event.request).then((networkResponse) => {
          return caches.open('api-cache').then((cache) => {
            console.log('Caching new response:', event.request.url);
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});

self.addEventListener('install', (event) => {
  console.log("Service Worker installing.");
});

self.addEventListener('activate', (event) => {
  console.log("Service Worker activating.");
});

self.addEventListener('load', (event) => {
  console.log("Service Worker loading.");
});




