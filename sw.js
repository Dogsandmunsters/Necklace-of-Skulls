// Service Worker for Necklace of Skulls PWA
const CACHE_NAME = 'necklace-of-skulls-v7';
const urlsToCache = [
    './',
    './index.html',
    './images/cover.jpg',
    './images/map.jpg',
    './images/filler_start.jpg',
    './images/filler_prologue.jpg',
    './images/filler_triumph.jpg',
    './images/filler_demise.jpg',
    './audio/click.wav',
    './audio/money.wav',
    './audio/hurt.mp3',
    './audio/map.wav'
];

// Install event - cache all resources
self.addEventListener('install', event => {
    self.skipWaiting();  // Activate new SW immediately
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone and cache the fresh response
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())  // Take control immediately
    );
});
