import React, { createContext, useContext, useState } from 'react';

export type WidgetKey = 'recommendations' | 'clientsChart' | 'topClients' | 'transactions' | 'bonusActions';

export interface WidgetSettings {
  visible: boolean;
  priority: number;
  usageCount: number;
}

const defaultOrder: WidgetKey[] = [
  'recommendations',
  'clientsChart',
  'topClients',
  'transactions',
  'bonusActions',
];

const defaultSettings: Record<WidgetKey, WidgetSettings> = {
  recommendations: { visible: true, priority: 1, usageCount: 0 },
  clientsChart: { visible: true, priority: 2, usageCount: 0 },
  topClients: { visible: true, priority: 3, usageCount: 0 },
  transactions: { visible: true, priority: 4, usageCount: 0 },
  bonusActions: { visible: true, priority: 5, usageCount: 0 },
};

interface WidgetsContextProps {
  order: WidgetKey[];
  setOrder: (order: WidgetKey[]) => void;
  settings: Record<WidgetKey, WidgetSettings>;
  setSettings: (settings: Record<WidgetKey, WidgetSettings>) => void;
  incrementUsage: (key: WidgetKey) => void;
  toggleWidget: (key: WidgetKey) => void;
}

const WidgetsContext = createContext<WidgetsContextProps | undefined>(undefined);

export const WidgetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [order, setOrder] = useState<WidgetKey[]>(() => {
    const saved = localStorage.getItem('widgets-order');
    return saved ? (JSON.parse(saved) as WidgetKey[]) : defaultOrder;
  });
  const [settings, setSettings] = useState<Record<WidgetKey, WidgetSettings>>(() => {
    const saved = localStorage.getItem('widgets-settings');
    return saved ? (JSON.parse(saved) as Record<WidgetKey, WidgetSettings>) : defaultSettings;
  });

  const setOrderAndSave = (newOrder: WidgetKey[]) => {
    setOrder(newOrder);
    localStorage.setItem('widgets-order', JSON.stringify(newOrder));
  };

  const setSettingsAndSave = (newSettings: Record<WidgetKey, WidgetSettings>) => {
    setSettings(newSettings);
    localStorage.setItem('widgets-settings', JSON.stringify(newSettings));
  };

  const incrementUsage = (key: WidgetKey) => {
    const updated = { ...settings, [key]: { ...settings[key], usageCount: settings[key].usageCount + 1 } };
    setSettingsAndSave(updated);
  };

  const toggleWidget = (key: WidgetKey) => {
    const updated = { ...settings, [key]: { ...settings[key], visible: !settings[key].visible } };
    setSettingsAndSave(updated);
  };

  return (
    <WidgetsContext.Provider value={{ order, setOrder: setOrderAndSave, settings, setSettings: setSettingsAndSave, incrementUsage, toggleWidget }}>
      {children}
    </WidgetsContext.Provider>
  );
};

export const useWidgets = () => {
  const ctx = useContext(WidgetsContext);
  if (!ctx) throw new Error('useWidgets must be used within WidgetsProvider');
  return ctx;
};
