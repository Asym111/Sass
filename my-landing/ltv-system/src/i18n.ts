import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      welcome: 'Добро пожаловать в LTV System!',
      search: 'Поиск клиентов или транзакций...',
      export: 'Экспорт',
      import: 'Импорт',
      settings: 'Настройки',
      notifications: 'Push-уведомления',
      darkMode: 'Тёмная тема',
      dashboard: 'Дашборд',
      actions: 'Акции',
      level: 'Уровень',
      // ...добавить остальные ключи
    },
  },
  en: {
    translation: {
      welcome: 'Welcome to LTV System!',
      search: 'Search clients or transactions...',
      export: 'Export',
      import: 'Import',
      settings: 'Settings',
      notifications: 'Push notifications',
      darkMode: 'Dark mode',
      dashboard: 'Dashboard',
      actions: 'Promotions',
      level: 'Level',
      // ...add more keys
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
