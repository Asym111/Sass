import React from 'react';
import { Dialog, DialogContent, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface GamePopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const GamePopup: React.FC<GamePopupProps> = ({ open, onClose, title, description, icon }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: 4, textAlign: 'center', position: 'relative', overflow: 'visible' }}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          style={{ display: 'inline-block', marginBottom: 16 }}
        >
          {icon || <EmojiEventsIcon color="warning" sx={{ fontSize: 64 }} />}
        </motion.div>
        <Typography variant="h5" fontWeight={800} mb={1}>{title}</Typography>
        {description && <Typography color="text.secondary" mb={2}>{description}</Typography>}
        <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 2, borderRadius: 3 }}>OK</Button>
      </DialogContent>
    </Dialog>
  );
};

export default GamePopup;
