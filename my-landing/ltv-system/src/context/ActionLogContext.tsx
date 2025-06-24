import React, { createContext, useContext, useState } from 'react';

export interface ActionLogItem {
  id: string;
  type: string;
  message: string;
  date: string;
}

interface ActionLogContextProps {
  log: ActionLogItem[];
  addLog: (item: Omit<ActionLogItem, 'id' | 'date'>) => void;
}

const ActionLogContext = createContext<ActionLogContextProps | undefined>(undefined);

export const ActionLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [log, setLog] = useState<ActionLogItem[]>([]);

  const addLog = (item: Omit<ActionLogItem, 'id' | 'date'>) => {
    setLog(prev => [
      { ...item, id: Math.random().toString(36).slice(2), date: new Date().toISOString() },
      ...prev,
    ]);
  };

  return (
    <ActionLogContext.Provider value={{ log, addLog }}>
      {children}
    </ActionLogContext.Provider>
  );
};

export const useActionLog = () => {
  const ctx = useContext(ActionLogContext);
  if (!ctx) throw new Error('useActionLog must be used within ActionLogProvider');
  return ctx;
};
