import React, { useState } from 'react';
import Joyride from 'react-joyride';
import type { Step } from 'react-joyride';

const steps: Step[] = [
  {
    target: '.ltv-header',
    content: 'Это шапка приложения. Здесь глобальный поиск, голосовое управление и навигация.',
    disableBeacon: true,
  },
  {
    target: '.sidebar-wow',
    content: 'WOW-меню: анимированный логотип, плавные эффекты и быстрый доступ к разделам!',
  },
  {
    target: '.MuiButton-containedPrimary',
    content: 'Здесь вы можете экспортировать данные в Excel или PDF.',
  },
  {
    target: '.wow-bg-dashboard',
    content: 'Современный WOW-фон и blur-эффекты для максимального визуального вау!',
  },
  {
    target: '.wow-bg-clients',
    content: 'WOW-фон и иллюстрация для страницы клиентов. Даже пустое состояние выглядит круто!',
  },
  {
    target: '.wow-bg-settings',
    content: 'Настройки с WOW-градиентом, SVG-иллюстрацией и анимацией.',
  },
  {
    target: '.MuiLinearProgress-root',
    content: 'Ваш прогресс и достижения отображаются здесь! Следите за уровнем и бейджами.',
  },
  {
    target: '.gamification-bar-tour',
    content: 'Геймификация: получайте ачивки, повышайте уровень и следите за прогрессом!',
  },
  {
    target: '.widget-manager-tour',
    content: 'Менеджер виджетов: управляйте видимостью и порядком дашборд-виджетов drag&drop!',
  },
  {
    target: '.MuiCard-root',
    content: 'Каждый виджет можно перемещать, скрывать и настраивать под себя.',
  },
  {
    target: '.MuiFab-root, [aria-label="Добавить клиента"]',
    content: 'Добавляйте новых клиентов одним кликом!',
  },
  {
    target: '.action-log-tour',
    content: 'Вся история действий и AI-советов фиксируется здесь. Можно фильтровать по типу, статусу, клиенту.',
  },
  {
    target: '.ai-advice-tour',
    content: 'AI-советы всегда под рукой: топ-3 на Dashboard, вся история — в ActionLog.',
  },
  {
    target: '.mass-messages-tour',
    content: 'Массовые рассылки: выберите сегмент, шаблон и отправьте сообщение в один клик.',
  },
  {
    target: '.dashboard-charts-tour',
    content: 'Аналитика: графики LTV, Retention и другие метрики для принятия решений.',
  },
];

const OnboardingTour: React.FC = () => {
  const [run] = useState(true);
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      styles={{ options: { zIndex: 20000 } }}
      locale={{ back: 'Назад', close: 'Закрыть', last: 'Готово', next: 'Далее', skip: 'Пропустить' }}
    />
  );
};

export default OnboardingTour;
