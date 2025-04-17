import React, { useState, useEffect } from 'react';
import { FaBell, FaBellSlash } from 'react-icons/fa';

const NotificationButton: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(false);

  useEffect(() => {
    // Проверяем поддержку уведомлений в браузере
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setNotificationsSupported(true);
      
      // Проверяем, было ли дано разрешение на уведомления
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, []);

  const requestNotificationPermission = async () => {
    try {
      // Запрашиваем разрешение на уведомления
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        
        // Регистрируем уведомления
        registerNotifications();
      } else {
        setNotificationsEnabled(false);
      }
    } catch (error) {
      console.error('Ошибка при запросе разрешения на уведомления:', error);
    }
  };

  const toggleNotifications = () => {
    if (notificationsEnabled) {
      // Если уже включены, выключаем
      unsubscribeFromNotifications();
      setNotificationsEnabled(false);
    } else {
      // Если выключены, включаем
      requestNotificationPermission();
    }
  };

  const registerNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Здесь должна быть логика для подписки на уведомления от сервера
      // Для демо-версии просто выводим сообщение об успешной регистрации
      console.log('Регистрация push-уведомлений успешна');
      
      // Пример отправки тестового уведомления
      setTimeout(() => {
        registration.showNotification('Умный список задач', {
          body: 'Уведомления успешно включены!',
          icon: '/icons/note-icon192.png'
        });
      }, 1000);
    } catch (error) {
      console.error('Ошибка при регистрации уведомлений:', error);
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Отписка от push-уведомлений успешна');
      }
    } catch (error) {
      console.error('Ошибка при отписке от уведомлений:', error);
    }
  };

  // Если браузер не поддерживает уведомления, не показываем кнопку
  if (!notificationsSupported) return null;

  return (
    <button 
      className={`notification-button ${notificationsEnabled ? 'enabled' : ''}`}
      onClick={toggleNotifications}
      aria-label={notificationsEnabled ? 'Отключить уведомления' : 'Включить уведомления'}
      title={notificationsEnabled ? 'Отключить уведомления' : 'Включить уведомления'}
    >
      {notificationsEnabled ? <FaBell /> : <FaBellSlash />}
    </button>
  );
};

export default NotificationButton; 