// Название кэша
const CACHE_NAME = 'todo-app-cache-v1';

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
  
  // Запускаем периодические проверки невыполненных задач
  initializePeriodicSync();
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

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  let notification = {
    title: 'Умный список задач',
    body: 'У вас есть невыполненные задачи!',
    icon: '/icons/note-icon192.png',
    badge: '/icons/note-icon192.png'
  };

  // Если пришли данные в уведомлении, используем их
  if (event.data) {
    try {
      notification = { ...notification, ...event.data.json() };
    } catch (e) {
      console.error('Ошибка парсинга данных уведомления:', e);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon,
      badge: notification.badge,
      actions: [
        {
          action: 'open',
          title: 'Открыть приложение'
        }
      ]
    })
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || event.action === '') {
    // Открыть приложение, если пользователь кликнул на уведомление
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Если приложение уже открыто, фокусируемся на нем
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          // Иначе открываем новое окно
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Периодическая проверка невыполненных задач и отправка уведомлений
const checkUncompletedTasks = async () => {
  try {
    // Открываем базу данных и проверяем невыполненные задачи
    // В реальном приложении здесь был бы код для проверки базы данных
    // Для демонстрации просто отправляем уведомление
    
    self.registration.showNotification('Умный список задач', {
      body: 'У вас есть невыполненные задачи!',
      icon: '/icons/note-icon192.png',
      badge: '/icons/note-icon192.png',
      actions: [
        {
          action: 'open',
          title: 'Перейти к задачам'
        }
      ]
    });
  } catch (error) {
    console.error('Ошибка при проверке невыполненных задач:', error);
  }
};

// Инициализация периодической синхронизации
const initializePeriodicSync = () => {
  // В реальном приложении можно использовать периодическую синхронизацию:
  // if ('periodicSync' in self.registration) {
  //   self.registration.periodicSync.register('check-tasks', {
  //     minInterval: 2 * 60 * 60 * 1000 // 2 часа
  //   });
  // }
  
  // Для демонстрации используем setInterval
  // В реальном приложении не рекомендуется использовать setInterval в Service Worker
  setInterval(checkUncompletedTasks, 2 * 60 * 60 * 1000); // Проверяем каждые 2 часа
}; 