// Название кэша
const CACHE_NAME = 'notes-app-cache-v1';

// Ресурсы для предварительного кэширования
const CACHED_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/note-icon192.png',
  '/icons/note-icon512.png',
  '/assets/index.css',
  '/assets/index.js'
];

// Установка сервис-воркера и кэширование базовых ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэш открыт');
        return cache.addAll(CACHED_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Стратегия обработки запросов: сначала сеть, затем кэш
self.addEventListener('fetch', (event) => {
  // Пропускаем запросы к API и другие запросы не GET
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/')
  ) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Если получен успешный ответ, клонируем его и сохраняем в кэш
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Если произошла ошибка (например, нет интернета), ищем в кэше
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Если запрос на страницу, возвращаем index.html (для SPA)
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            return new Response('Нет соединения с интернетом');
          });
      })
  );
});

// Синхронизация данных при восстановлении соединения
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notes') {
    // Здесь может быть код для синхронизации данных с сервером
    console.log('Синхронизация данных...');
  }
});

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/note-icon192.png',
    badge: '/icons/note-icon192.png'
  };
  
  event.waitUntil(
    self.registration.showNotification('PWA Заметки', options)
  );
}); 