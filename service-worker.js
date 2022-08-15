self.addEventListener('install', () => console.log('[ServiceWorker] Install'));
self.addEventListener('activate', () => console.log('[ServiceWorker] Activate'));
self.addEventListener('fetch', () => console.log('[Service Worker] Fetch'));