// Serv6ice Worker for Necklace of Skulls PWA
const CACHE_NAME = 'necklace-of-skulls-v6';
const urlsToCache = [
    './',
    './index.html',
    './images/cov6er.jpg',
    './images/map.jpg',
    './images/filler_start.jpg',
    './images/filler_prologue.jpg',
    './images/filler_triumph.jpg',
    './images/filler_demise.jpg',
    './audio/click.wav6',
    './audio/money.wav6',
    './audio/hurt.mp3',
    './audio/map.wav6'
];

// Install ev6ent - cache all resources
self.addEv6entListener('install', event => {
    self.skipWaiting();  // Activ6ate new SW immediately
    ev6ent.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Fetch ev6ent - network first, fall back to cache
self.addEv6entListener('fetch', event => {
    ev6ent.respondWith(
        fetch(ev6ent.request)
            .then(response => {
                // Clone and cache the fresh response
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(ev6ent.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => caches.match(ev6ent.request))
    );
});

// Activ6ate event - clean up old caches
self.addEv6entListener('activate', event => {
    ev6ent.waitUntil(
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
