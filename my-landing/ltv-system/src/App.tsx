import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Button, Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { ThemeProviderCustom, useThemeMode } from './context/ThemeContext';
import { WidgetsProvider } from './context/WidgetsContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ActionLogProvider } from './context/ActionLogContext';
import WidgetsSortable from './components/WidgetsSortable';
import FabMenu from './components/FabMenu';
import ModernModal from './components/ModernModal';
import AddClientForm from './components/AddClientForm';
import DataExportImport from './components/DataExportImport';
import PromoGenerator from './components/PromoGenerator';
import ReportGenerator from './components/ReportGenerator';
import WidgetManager from './components/WidgetManager';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import OnboardingTour from './components/OnboardingTour';
import ActionLog from './components/ActionLog';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Actions from './pages/Actions';
import Transactions from './pages/Transactions';
import MassMessages from './pages/MassMessages';
import AiChat from './pages/AiChat';
import LoginPage from './pages/LoginPage';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import { NotificationProvider } from './contexts/NotificationContext';
import AiActions from './pages/AiActions';

function App() {
  return (
    <ThemeProviderCustom>
      <NotificationProvider>
        <WidgetsProvider>
          <ActionLogProvider>
            <AuthProvider>
              <AppWithTheme />
            </AuthProvider>
          </ActionLogProvider>
        </WidgetsProvider>
      </NotificationProvider>
    </ThemeProviderCustom>
  );
}

function AppWithTheme() {
  const { mode, setMode, resolvedMode } = useThemeMode();
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [widgetManagerOpen, setWidgetManagerOpen] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={resolvedMode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <OnboardingTour />
      <Header onMenuClick={() => setSidebarMobileOpen(true)} />
      <Button
        onClick={() => setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light')}
        variant="contained"
        sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}
      >
        {mode === 'system' ? 'Системная' : mode === 'light' ? 'Светлая' : 'Тёмная'}
      </Button>
      <Box sx={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', background: 'linear-gradient(120deg,#f3e8ff 0%,#f9fafb 100%)' }}>
        <Sidebar
          onWidgetManagerOpen={() => setWidgetManagerOpen(true)}
          mobileOpen={sidebarMobileOpen}
          onMobileClose={() => setSidebarMobileOpen(false)}
        />
        <Box sx={{ flex: 1, maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px 0' : '32px 0' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/actions" element={<ProtectedRoute><Actions /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/mass-messages" element={<ProtectedRoute><MassMessages /></ProtectedRoute>} />
            <Route path="/ai-chat" element={<ProtectedRoute><AiChat /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/ai-actions" element={<ProtectedRoute><AiActions /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ActionLog />
        </Box>
      </Box>
      <FabMenu
        onAddClient={() => setAddClientOpen(true)}
        onExport={() => setExportOpen(true)}
        onReport={() => setReportOpen(true)}
        onPromo={() => setPromoOpen(true)}
      />
      <WidgetManager open={widgetManagerOpen} onClose={() => setWidgetManagerOpen(false)} />
      <ModernModal open={addClientOpen} onClose={() => setAddClientOpen(false)} title="Добавить клиента">
        <AddClientForm onSubmit={() => setAddClientOpen(false)} onCancel={() => setAddClientOpen(false)} />
      </ModernModal>
      <ModernModal open={exportOpen} onClose={() => setExportOpen(false)} title="Экспорт / Импорт данных">
        <DataExportImport />
      </ModernModal>
      <ModernModal open={promoOpen} onClose={() => setPromoOpen(false)} title="Генератор акций">
        <PromoGenerator />
      </ModernModal>
      <ModernModal open={reportOpen} onClose={() => setReportOpen(false)} title="Генерация отчёта">
        <ReportGenerator />
      </ModernModal>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
