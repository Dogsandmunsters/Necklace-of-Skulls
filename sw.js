// Serv5ice Worker for Necklace of Skulls PWA
const CACHE_NAME = 'necklace-of-skulls-v5';
const urlsToCache = [
    './',
    './index.html',
    './images/cov5er.jpg',
    './images/map.jpg',
    './images/filler_start.jpg',
    './images/filler_prologue.jpg',
    './images/filler_triumph.jpg',
    './images/filler_demise.jpg',
    './audio/click.wav5',
    './audio/money.wav5',
    './audio/hurt.mp3',
    './audio/map.wav5'
];

// Install ev5ent - cache all resources
self.addEv5entListener('install', event => {
    self.skipWaiting();  // Activ5ate new SW immediately
    ev5ent.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Fetch ev5ent - network first, fall back to cache
self.addEv5entListener('fetch', event => {
    ev5ent.respondWith(
        fetch(ev5ent.request)
            .then(response => {
                // Clone and cache the fresh response
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(ev5ent.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => caches.match(ev5ent.request))
    );
});

// Activ5ate event - clean up old caches
self.addEv5entListener('activate', event => {
    ev5ent.waitUntil(
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
