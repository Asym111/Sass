import React from 'react';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="ltv-app-container">
      <Header />
      <div className="ltv-content-with-sidebar">
        <Sidebar />
        <main className="ltv-main-content">
          {children}
        </main>
      </div>
    </div>
  );
};
