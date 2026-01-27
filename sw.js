// Service Worker for Necklace of Skulls PWA
const CACHE_NAME = 'necklace-of-skulls-v1';
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
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
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
        })
    );
});
