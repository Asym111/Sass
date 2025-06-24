import React, { useState, useEffect } from 'react';
import { messagesService, clientsService } from '../../services/api';
import type { Message, Client } from '../../types/api';
import './Messages.scss';
import { toast } from 'react-toastify';

export const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string |null>(null);

  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');
  const [messageChannel, setMessageChannel] = useState<Message['channel']>('email');

  useEffect(() => {
    loadClientsAndMessages();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      loadMessages(selectedClientId);
    } else {
      setMessages([]);
    }
  }, [selectedClientId]);

  const loadClientsAndMessages = async () => {
    try {
      setLoading(true);
      const clientsResponse = await clientsService.getList();
      setClients(clientsResponse.data);
      if (clientsResponse.data.length > 0) {
        setSelectedClientId(clientsResponse.data[0].id);
      }
    } catch (err) {
      setError('Ошибка при загрузке данных: ' + (err as Error).message);
      console.error('Ошибка загрузки клиентов/сообщений:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (clientId: string) => {
    try {
      setLoading(true);
      const messagesResponse = await messagesService.getList({ clientId });
      setMessages(messagesResponse.data);
    } catch (err) {
      setError('Ошибка при загрузке сообщений для клиента: ' + (err as Error).message);
      console.error('Ошибка загрузки сообщений:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !messageContent) {
      toast.error('Выберите клиента и введите текст сообщения.');
      return;
    }

    try {
      const sentMessage = await messagesService.send({
        clientId: selectedClientId,
        channel: messageChannel,
        content: messageContent,
      });
      setMessages(prevMessages => [...prevMessages, sentMessage.data]);
      setMessageContent('');
    } catch (err) {
      setError('Ошибка при отправке сообщения: ' + (err as Error).message);
      console.error('Ошибка отправки сообщения:', err);
    }
  };

  return (
    <section className="ltv-messages">
      <h2>Коммуникации и сообщения</h2>

      {loading ? (
        <div className="ltv-messages__loading">Загрузка...</div>
      ) : error ? (
        <div className="ltv-messages__error">{error}</div>
      ) : (
        <div className="ltv-messages__grid">
          <div className="ltv-messages__sidebar ltv-card">
            <h3>Выберите клиента</h3>
            {clients.length === 0 ? (
              <p>Клиенты не найдены. Создайте клиента, чтобы начать общение.</p>
            ) : (
              <select
                className="form-group__select"
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.phone})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="ltv-messages__main">
            {selectedClientId ? (
              <>
                <h3>История сообщений для {clients.find(c => c.id === selectedClientId)?.name}</h3>
                <div className="ltv-messages__history ltv-card">
                  {messages.length === 0 ? (
                    <p className="ltv-messages__no-messages">Нет сообщений для этого клиента.</p>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id} className={`ltv-message-item ltv-message-item--${msg.channel}`}>
                        <div className="ltv-message-item__header">
                          <span>{new Date(msg.created_at).toLocaleString()}</span>
                          <span className="ltv-message-item__channel">{msg.channel.toUpperCase()}</span>
                        </div>
                        <p className="ltv-message-item__content">{msg.content}</p>
                        {msg.status === 'failed' && (
                          <p className="ltv-message-item__status ltv-message-item__status--failed">
                            Ошибка: {msg.error_details || 'Неизвестно'}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="ltv-messages__send-form ltv-card">
                  <h3>Отправить сообщение</h3>
                  <form onSubmit={handleSendMessage}>
                    <div className="form-group">
                      <label htmlFor="messageChannel">Канал</label>
                      <select
                        id="messageChannel"
                        value={messageChannel}
                        onChange={e => setMessageChannel(e.target.value as Message['channel'])}
                        className="form-group__select"
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="telegram">Telegram</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="messageContent">Содержание сообщения</label>
                      <textarea
                        id="messageContent"
                        value={messageContent}
                        onChange={e => setMessageContent(e.target.value)}
                        rows={4}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="ltv-button">Отправить сообщение</button>
                  </form>
                </div>
              </>
            ) : (
              <div className="ltv-messages__placeholder ltv-card">
                <h3>Выберите клиента для просмотра или отправки сообщений</h3>
                <p>Используйте выпадающий список слева, чтобы выбрать клиента.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
