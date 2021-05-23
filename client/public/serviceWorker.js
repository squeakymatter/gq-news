//define callback for the `install` event and choose what to cache

let CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = ['/', '/index.html', '/sign_in', '/user_area/profile'];
self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});
