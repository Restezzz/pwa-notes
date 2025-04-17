import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Глобальная переменная для хранения информации о необходимости открыть форму добавления задачи
declare global {
  interface Window {
    shouldOpenNewTaskForm?: boolean;
  }
}

// Проверяем URL на наличие параметра newTask
const urlParams = new URLSearchParams(window.location.search);
window.shouldOpenNewTaskForm = urlParams.get('newTask') === 'true';

// Регистрация Service Worker для PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('Service Worker зарегистрирован:', registration);
      })
      .catch(error => {
        console.error('Ошибка при регистрации Service Worker:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
