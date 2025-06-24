import React, { useState, useEffect } from 'react';
import { actionsService } from '../../services/api';
import type { Action } from '../../types/api';
import './Actions.scss';

export const Actions: React.FC = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAction, setNewAction] = useState<Omit<Action, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    conditions: {
      segment: 'all'
    },
    reward: {
      type: 'bonus',
      amount: 0
    },
    status: 'draft',
    created_at: '',
    updated_at: ''
  });

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      setLoading(true);
      const response = await actionsService.getList();
      setActions(response.data);
    } catch (err) {
      setError('Ошибка при загрузке акций');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await actionsService.create({
        ...newAction,
        businessId: '',
        status: 'draft'
      } as any);

      setActions([...actions, response.data]);
      setNewAction({
        name: '',
        description: '',
        conditions: {
          segment: 'all'
        },
        reward: {
          type: 'bonus',
          amount: 0
        },
        status: 'draft',
        created_at: '',
        updated_at: ''
      });
    } catch (err) {
      setError('Ошибка при создании акции');
      console.error(err);
    }
  };

  const handleActivateDeactivate = async (actionId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'draft' : 'active';
      await actionsService.activate(actionId, newStatus === 'active');
      setActions(prevActions =>
        prevActions.map(action =>
          action.id === actionId ? { ...action, status: newStatus } : action
        )
      );
    } catch (err) {
      setError('Ошибка при изменении статуса акции');
      console.error(err);
    }
  };

  return (
    <section className="ltv-actions">
      <h2>Акции и кампании</h2>
      {loading ? (
        <div className="ltv-actions__loading">Загрузка...</div>
      ) : error ? (
        <div className="ltv-actions__error">{error}</div>
      ) : (
        <div className="ltv-actions__grid">
          <div className="ltv-actions__list">
            <h3>Список акций</h3>
            <div className="ltv-actions__cards">
              {actions.map(action => (
                <div key={action.id} className="ltv-actions__card">
                  <div className="ltv-actions__card-header">
                    <h4>{action.name}</h4>
                    <span className={`ltv-actions__status ltv-actions__status--${action.status}`}>
                      {action.status === 'active' ? 'Активна' : action.status === 'draft' ? 'Черновик' : action.status === 'completed' ? 'Завершена' : 'Отменена'}
                    </span>
                  </div>
                  <div className="ltv-actions__card-body">
                    <p>{action.description}</p>
                    <div className="ltv-actions__details">
                      <p><strong>Условия:</strong></p>
                      <ul>
                        {action.conditions?.segment && (
                          <li>Сегмент: {action.conditions.segment}</li>
                        )}
                        {action.conditions?.minSpent && (
                          <li>Мин. сумма: {action.conditions.minSpent} ₽</li>
                        )}
                        {action.conditions?.dateRange && (
                          <li>Период: {new Date(action.conditions.dateRange.start).toLocaleDateString()} — {new Date(action.conditions.dateRange.end).toLocaleDateString()}</li>
                        )}
                      </ul>
                      <p><strong>Награда:</strong> {action.reward?.type === 'bonus' ? `${action.reward.amount} бонусов` : `${action.reward?.amount}% скидка`}</p>
                    </div>
                  </div>
                  <div className="ltv-actions__card-footer">
                    <button
                      className="ltv-button"
                      onClick={() => handleActivateDeactivate(action.id, action.status)}
                    >
                      {action.status === 'active' ? 'Остановить' : 'Активировать'}
                    </button>
                  </div>
                </div>
              ))}
              {actions.length === 0 && !loading && !error && <p>Акции не найдены.</p>}
            </div>
          </div>
          <div className="ltv-actions__form">
            <h3>Создать акцию</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название</label>
                <input
                  type="text"
                  value={newAction.name || ''}
                  onChange={e => setNewAction({ ...newAction, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={newAction.description || ''}
                  onChange={e => setNewAction({ ...newAction, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Сегмент клиентов</label>
                <select
                  value={newAction.conditions?.segment || 'all'}
                  onChange={e => setNewAction({
                    ...newAction,
                    conditions: { ...newAction.conditions, segment: e.target.value }
                  })}
                  required
                >
                  <option value="all">Все клиенты</option>
                  <option value="new">Новые клиенты</option>
                  <option value="vip">VIP клиенты</option>
                </select>
              </div>
              <div className="form-group">
                <label>Тип награды</label>
                <select
                  value={newAction.reward?.type || 'bonus'}
                  onChange={e => setNewAction({
                    ...newAction,
                    reward: { ...newAction.reward, type: e.target.value as 'bonus' | 'discount' }
                  })}
                  required
                >
                  <option value="bonus">Бонусы</option>
                  <option value="discount">Скидка</option>
                </select>
              </div>
              <div className="form-group">
                <label>{newAction.reward?.type === 'bonus' ? 'Количество бонусов' : 'Процент скидки'}</label>
                <input
                  type="number"
                  min="0"
                  max={newAction.reward?.type === 'discount' ? 100 : undefined}
                  value={newAction.reward?.amount || 0}
                  onChange={e => setNewAction({
                    ...newAction,
                    reward: { ...newAction.reward, amount: Number(e.target.value) }
                  })}
                  required
                />
              </div>
              <button type="submit" className="ltv-button">Создать акцию</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
