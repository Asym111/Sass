import React from 'react';
import { NavLink } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText, Box, useTheme, IconButton, Tooltip, Drawer } from '@mui/material';
import HomeIcon from '@mui/icons-material/HomeRounded';
import PeopleIcon from '@mui/icons-material/PeopleAltRounded';
import LocalOfferIcon from '@mui/icons-material/LocalOfferRounded';
import InsightsIcon from '@mui/icons-material/InsightsRounded';
import MessageIcon from '@mui/icons-material/MessageRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import WidgetsIcon from '@mui/icons-material/Widgets';
import LtvLogo from '../../assets/LtvLogo.svg';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', label: 'Главная', icon: <HomeIcon /> },
  { to: '/clients', label: 'Клиенты', icon: <PeopleIcon /> },
  { to: '/actions', label: 'Акции', icon: <LocalOfferIcon /> },
  { to: '/analytics', label: 'Аналитика', icon: <InsightsIcon /> },
  { to: '/messages', label: 'Сообщения', icon: <MessageIcon /> },
  { to: '/settings', label: 'Настройки', icon: <SettingsIcon /> },
  { to: '/ai-actions', label: 'AI-маркетинг', icon: <InsightsIcon /> },
];

const SidebarContent = ({ onWidgetManagerOpen }: { onWidgetManagerOpen?: () => void }) => {
  const theme = useTheme();
  return (
    <Box className="sidebar-wow" sx={{
      width: { xs: 72, sm: 220 },
      py: 3,
      px: { xs: 0, sm: 2 },
      minHeight: '100vh',
      background: 'linear-gradient(160deg,#f3e8ff 0%,#a21caf11 100%)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 32px 0 rgba(127,83,172,0.10)',
    }}>
      {/* WOW blur-эффект */}
      <Box sx={{
        position: 'absolute',
        top: -80,
        left: -80,
        width: 180,
        height: 180,
        background: 'radial-gradient(circle, #32c5ff33 0%, transparent 80%)',
        filter: 'blur(40px)',
        zIndex: 0,
      }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, zIndex: 1 }}>
        <motion.img
          src={LtvLogo}
          alt="LTV Logo"
          style={{ height: 56, marginBottom: 8, filter: 'drop-shadow(0 6px 16px rgba(127,83,172,0.13))' }}
          initial={{ scale: 0.9, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 8 }}
          whileHover={{ scale: 1.08, rotate: 3 }}
        />
        <motion.span
          style={{
            fontFamily: 'Montserrat, Nunito, Arial, sans-serif',
            fontWeight: 900,
            fontSize: '1.5rem',
            letterSpacing: '-1px',
            background: 'linear-gradient(90deg,#32c5ff 0%,#7f53ac 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            display: 'block',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >LTV System</motion.span>
        <Tooltip title="Управление виджетами">
          <IconButton sx={{ mt: 1, color: theme.palette.primary.main, transition: 'all .2s', ':hover': { bgcolor: '#f3e8ff' } }} onClick={onWidgetManagerOpen}>
            <WidgetsIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <List sx={{ zIndex: 1 }}>
        {navItems.map((item, idx) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.07 }}
          >
            <ListItemButton
              component={NavLink}
              to={item.to}
              sx={{
                borderRadius: 3,
                mb: 1,
                transition: 'all .2s',
                '&.active': {
                  background: theme.palette.primary.main,
                  color: '#fff',
                  boxShadow: '0 2px 12px 0 rgba(127,83,172,0.13)',
                  '& .MuiListItemIcon-root': { color: '#fff' },
                },
                ':hover': {
                  background: '#f3e8ff',
                  color: theme.palette.primary.main,
                  boxShadow: '0 2px 12px 0 rgba(127,83,172,0.10)',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </motion.div>
        ))}
      </List>
    </Box>
  );
};

export const Sidebar: React.FC<{ onWidgetManagerOpen?: () => void; mobileOpen?: boolean; onMobileClose?: () => void }> = ({ onWidgetManagerOpen, mobileOpen = false, onMobileClose }) => {
  const theme = useTheme();
  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { xs: 0, sm: 220 },
          flexShrink: 0,
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg,#f3e8ff 0%,#f9fafb 100%)'
            : 'linear-gradient(135deg,#23232b 0%,#18181b 100%)',
          borderRadius: { xs: 0, sm: '32px' },
          boxShadow: '0 4px 24px 0 rgba(162,28,175,0.07)',
          minHeight: '80vh',
          display: { xs: 'none', sm: 'block' },
          mt: 4,
          ml: 2
        }}
      >
        <SidebarContent onWidgetManagerOpen={onWidgetManagerOpen} />
      </Box>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: 220,
            boxSizing: 'border-box',
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(135deg,#f3e8ff 0%,#f9fafb 100%)'
              : 'linear-gradient(135deg,#23232b 0%,#18181b 100%)',
            borderRadius: '0 32px 32px 0'
          }
        }}
      >
        <SidebarContent onWidgetManagerOpen={onWidgetManagerOpen} />
      </Drawer>
    </>
  );
};
