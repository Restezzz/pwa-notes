# Умный список задач - PWA приложение

Прогрессивное веб-приложение (PWA) для управления списком задач с поддержкой офлайн-режима и push-уведомлений.

## Функции и возможности

- **Работа офлайн**: благодаря Service Worker и кэшированию, приложение работает даже без интернета
- **Push-уведомления**: уведомления о новых задачах и напоминания о невыполненных задачах
- **Установка на домашний экран**: полноценное приложение на вашем устройстве
- **Локальное хранение данных**: все задачи сохраняются в IndexedDB
- **Фильтрация задач**: "Все", "Активные", "Выполненные"

## Технологии

- React + TypeScript
- Vite (сборка)
- IndexedDB (Dexie.js)
- Service Worker для PWA
- Web Push API

## Установка и запуск

Для локальной разработки:

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшн
npm run build

# Предпросмотр продакшн-версии
npm run preview
```

## Использование

1. **Добавление задачи**: Нажмите на кнопку "+" и введите текст задачи
2. **Отметка выполнения**: Нажмите на круглую кнопку рядом с задачей
3. **Удаление задачи**: Нажмите на иконку корзины
4. **Фильтрация задач**: Используйте фильтры "Все", "Активные", "Выполненные"
5. **Включение уведомлений**: Нажмите на иконку колокольчика и разрешите уведомления

## Установка как PWA

1. Откройте приложение в Chrome или другом поддерживаемом браузере
2. В меню браузера выберите "Установить приложение" или нажмите на значок установки в адресной строке
3. Следуйте инструкциям для установки

## Особенности PWA

- **App Shell архитектура**: Мгновенная загрузка интерфейса
- **Push-уведомления**: Уведомления о задачах даже когда приложение не открыто
- **Адаптивный дизайн**: Работает на мобильных устройствах и десктопе
- **Обновления в фоне**: Автоматическое обновление сервис-воркера

## Структура проекта

```
public/           # Статические файлы
  ├─ icons/       # Иконки для PWA
  ├─ manifest.json # Манифест для PWA
src/
  ├─ components/  # React компоненты
  ├─ db.ts        # Настройка IndexedDB с Dexie
  ├─ App.tsx      # Главный компонент приложения
  ├─ main.tsx     # Точка входа React приложения
  ├─ App.css      # Стили для App.tsx
  └─ index.css    # Глобальные стили
```

## Лицензия

MIT
