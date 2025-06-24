import React, { useState } from 'react';
import './Settings.scss';
import { toast } from 'react-toastify';

export const Settings: React.FC = () => {
  const [businessName, setBusinessName] = useState<string>('Название вашей компании');
  const [contactEmail, setContactEmail] = useState<string>('info@yourcompany.com');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Сохранение настроек:', {
      businessName,
      contactEmail,
      notificationsEnabled,
    });
    toast.success('Настройки сохранены!');
  };

  return (
    <section className="ltv-settings">
      <h2>Настройки приложения</h2>

      <div className="ltv-settings__section ltv-card">
        <h3>Общие настройки бизнеса</h3>
        <form onSubmit={handleSaveChanges}>
          <div className="form-group">
            <label htmlFor="businessName">Название компании</label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactEmail">Контактный email</label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <div className="form-group form-group--checkbox">
            <input
              id="notificationsEnabled"
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
            <label htmlFor="notificationsEnabled">Включить уведомления</label>
          </div>
          <button type="submit" className="ltv-button">Сохранить изменения</button>
        </form>
      </div>

      <div className="ltv-settings__section ltv-card">
        <h3>Управление пользователями</h3>
        <p>Здесь будут настройки, связанные с управлением пользователями и их ролями.</p>
        <button className="ltv-button ltv-button--secondary">Перейти к пользователям</button>
      </div>

      <div className="ltv-settings__section ltv-card">
        <h3>Интеграции</h3>
        <p>Настройка интеграций со сторонними сервисами (SMS-шлюзы, CRM и т.д.).</p>
        <button className="ltv-button ltv-button--secondary">Настроить интеграции</button>
      </div>
    </section>
  );
};
