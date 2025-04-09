import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Обработчики событий для онлайн/офлайн статуса
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Добавляем слушатели
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Удаляем слушатели при размонтировании
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Если онлайн, не показываем индикатор
  if (isOnline) {
    return null;
  }

  return (
    <div className="offline-indicator">
      <FaExclamationTriangle />
      <span>Офлайн-режим</span>
    </div>
  );
};

export default OfflineIndicator; 