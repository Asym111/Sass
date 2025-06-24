import { Card, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

export default function AnimatedCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.045, boxShadow: '0 8px 32px 0 rgba(162,28,175,0.13)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        borderRadius: 28,
        background: 'linear-gradient(135deg,#f3e8ff 0%,#f9fafb 100%)',
        boxShadow: '0 4px 24px 0 rgba(162,28,175,0.07)',
        margin: '0 auto 36px',
        maxWidth: 420,
      }}
    >
      <Card elevation={0} sx={{ borderRadius: 4, background: 'transparent', boxShadow: 'none' }}>
        <CardContent>
          <Typography variant="h5" fontWeight={800} color="primary" gutterBottom sx={{ letterSpacing: '-0.5px' }}>{title}</Typography>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
