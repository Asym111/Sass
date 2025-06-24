import React, { useState, useEffect } from 'react';
import { clientsService, bonusesService } from '../../services/api';
import type { Client, Transaction } from '../../types/api';
import './Clients.scss';

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showBonusesModal, setShowBonusesModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Omit<Client, 'id' | 'business_id' | 'created_at' | 'updated_at' | 'bonuses_balance' | 'total_spent'>>();
  const [bonusAmount, setBonusAmount] = useState<number>(0);
  const [bonusReason, setBonusReason] = useState<string>('');
  const [bonusType, setBonusType] = useState<'charge' | 'writeoff'>('charge');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientsService.getList();
      setClients(response.data);
    } catch (err) {
      setError('Ошибка при загрузке клиентов');
      console.error('Ошибка загрузки клиентов:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient?.name || !newClient?.phone) {
      alert('Имя и телефон обязательны для нового клиента.');
      return;
    }
    try {
      const createdClient = await clientsService.create(newClient as Omit<Client, 'id' | 'createdAt' | 'updatedAt'>);
      setClients(prevClients => [...prevClients, createdClient.data]);
      setNewClient(undefined);
      setShowAddClientModal(false);
    } catch (err) {
      setError('Ошибка при добавлении клиента');
      console.error('Ошибка добавления клиента:', err);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      try {
        await clientsService.delete(clientId);
        setClients(prevClients => prevClients.filter(client => client.id !== clientId));
      } catch (err) {
        setError('Ошибка при удалении клиента');
        console.error('Ошибка удаления клиента:', err);
      }
    }
  };

  const handleBonusesAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      if (bonusType === 'charge') {
        await bonusesService.charge(selectedClient.id, bonusAmount, bonusReason);
      } else {
        await bonusesService.writeoff(selectedClient.id, bonusAmount, bonusReason);
      }
      await loadClients();
      setShowBonusesModal(false);
      setBonusAmount(0);
      setBonusReason('');
      setSelectedClient(null);
    } catch (err) {
      setError(`Ошибка при ${bonusType === 'charge' ? 'начислении' : 'списании'} бонусов`);
      console.error('Ошибка операций с бонусами:', err);
    }
  };

  return (
    <section className="ltv-clients">
      <h2>Управление клиентами</h2>

      <div className="ltv-clients__toolbar">
        <button className="ltv-button" onClick={() => setShowAddClientModal(true)}>
          Добавить нового клиента
        </button>
      </div>

      {loading ? (
        <div className="ltv-clients__loading">Загрузка клиентов...</div>
      ) : error ? (
        <div className="ltv-clients__error">{error}</div>
      ) : (
        <div className="ltv-clients__list">
          {clients.length === 0 && <p>Клиенты не найдены.</p>}
          {clients.map(client => (
            <div key={client.id} className="ltv-client-card ltv-card">
              <h3>{client.name}</h3>
              <p><strong>Телефон:</strong> {client.phone}</p>
              {client.email && <p><strong>Email:</strong> {client.email}</p>}
              <p><strong>Баланс бонусов:</strong> {client.bonuses_balance || 0} ₽</p>
              <p><strong>Потрачено всего:</strong> {client.total_spent || 0} ₽</p>
              {client.segment && <p><strong>Сегмент:</strong> {client.segment}</p>}
              {client.last_visit && <p><strong>Последний визит:</strong> {new Date(client.last_visit).toLocaleDateString()}</p>}
              <div className="ltv-client-card__actions">
                <button className="ltv-button ltv-button--secondary" onClick={() => { setSelectedClient(client); setShowBonusesModal(true); setBonusType('charge'); }}>Начислить бонусы</button>
                <button className="ltv-button ltv-button--danger" onClick={() => { setSelectedClient(client); setShowBonusesModal(true); setBonusType('writeoff'); }}>Списать бонусы</button>
                <button className="ltv-button ltv-button--edit" onClick={() => {/* TODO: Реализовать редактирование */ alert('Функция редактирования пока не реализована.') }}>Редактировать</button>
                <button className="ltv-button ltv-button--delete" onClick={() => handleDeleteClient(client.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddClientModal && (
        <div className="ltv-modal-overlay">
          <div className="ltv-modal-content ltv-card">
            <h3>Добавить нового клиента</h3>
            <form onSubmit={handleAddClient}>
              <div className="form-group">
                <label htmlFor="clientName">Имя клиента</label>
                <input
                  id="clientName"
                  type="text"
                  value={newClient?.name || ''}
                  onChange={e => setNewClient({ ...newClient!, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="clientPhone">Телефон</label>
                <input
                  id="clientPhone"
                  type="tel"
                  value={newClient?.phone || ''}
                  onChange={e => setNewClient({ ...newClient!, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="clientEmail">Email (необязательно)</label>
                <input
                  id="clientEmail"
                  type="email"
                  value={newClient?.email || ''}
                  onChange={e => setNewClient({ ...newClient!, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="clientBirthday">Дата рождения (необязательно)</label>
                <input
                  id="clientBirthday"
                  type="date"
                  value={newClient?.birthday || ''}
                  onChange={e => setNewClient({ ...newClient!, birthday: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="clientSegment">Сегмент (необязательно)</label>
                <input
                  id="clientSegment"
                  type="text"
                  value={newClient?.segment || ''}
                  onChange={e => setNewClient({ ...newClient!, segment: e.target.value })}
                />
              </div>
              <div className="ltv-modal-actions">
                <button type="submit" className="ltv-button">Добавить</button>
                <button type="button" className="ltv-button ltv-button--cancel" onClick={() => setShowAddClientModal(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBonusesModal && selectedClient && (
        <div className="ltv-modal-overlay">
          <div className="ltv-modal-content ltv-card">
            <h3>{bonusType === 'charge' ? 'Начислить' : 'Списать'} бонусы для {selectedClient.name}</h3>
            <p>Текущий баланс: {selectedClient.bonuses_balance || 0} ₽</p>
            <form onSubmit={handleBonusesAction}>
              <div className="form-group">
                <label htmlFor="bonusAmount">Сумма бонусов</label>
                <input
                  id="bonusAmount"
                  type="number"
                  value={bonusAmount}
                  onChange={e => setBonusAmount(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bonusReason">Причина</label>
                <textarea
                  id="bonusReason"
                  value={bonusReason}
                  onChange={e => setBonusReason(e.target.value)}
                  required
                />
              </div>
              <div className="ltv-modal-actions">
                <button type="submit" className="ltv-button">{bonusType === 'charge' ? 'Начислить' : 'Списать'}</button>
                <button type="button" className="ltv-button ltv-button--cancel" onClick={() => setShowBonusesModal(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
