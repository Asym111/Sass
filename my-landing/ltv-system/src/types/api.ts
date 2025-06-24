export interface User {
  id: string;
  email: string;
  role: string;
  businessId: string;
  // Добавьте другие поля пользователя, если они есть в вашей БД
}

export interface Client {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  email?: string;
  birthday?: string; // DATE в SQL, лучше использовать string для ISO даты
  bonuses_balance: number;
  total_spent: number;
  last_visit?: string; // TIMESTAMP в SQL
  segment?: string;
  preferred_channel?: string;
  created_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
}

export interface Transaction {
  id: string;
  business_id: string;
  client_id: string;
  user_id?: string;
  type: 'charge' | 'writeoff';
  amount: number;
  reason?: string;
  reference_id?: string;
  status: string;
  created_at: string;
}

export interface Action {
  id: string;
  businessId: string;
  name: string;
  description: string;
  conditions: {
    segment?: string;
    minSpent?: number;
    dateRange?: {
      start: string;
      end: string;
    };
    [key: string]: any; // Для других возможных условий
  };
  reward: {
    type: 'bonus' | 'discount';
    amount: number;
  };
  status: 'active' | 'draft' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  business_id: string;
  client_id: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'telegram'; // Пример каналов
  content: string;
  status: 'sent' | 'pending' | 'failed';
  error_details?: string;
  sent_at?: string;
  created_at: string;
}

export interface AnalyticsSummary {
  period: string;
  totalClients: number;
  activeClients: number;
  averageLTV: number;
  returnRate: number;
  totalBonusesIssued: number;
  // Добавьте другие поля сводки аналитики
}

export interface EducationMaterial {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'video' | 'webinar';
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface AutomationTask {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  trigger: string;
  actions: string[];
  created_at: string;
  updated_at: string;
}
