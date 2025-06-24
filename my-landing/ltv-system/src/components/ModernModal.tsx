import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme, Slide } from '@mui/material';
import type { SlideProps } from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModernModal({ open, onClose, title, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 5,
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg,#f3e8ff 0%,#f9fafb 100%)'
            : 'linear-gradient(135deg,#23232b 0%,#18181b 100%)',
          boxShadow: '0 8px 40px 0 rgba(162,28,175,0.13)',
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.5px' }}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary" sx={{ borderRadius: 3, fontWeight: 700 }}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}
