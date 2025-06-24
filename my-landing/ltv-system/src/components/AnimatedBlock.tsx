import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface AnimatedBlockProps {
  children: React.ReactNode;
  delay?: number;
  effect?: 'fade' | 'slide' | 'scale';
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
  style?: React.CSSProperties;
}

const getVariants = (effect: string, direction: string): Variants => {
  switch (effect) {
    case 'slide':
      let x = 0,
        y = 0;
      if (direction === 'up') y = 32;
      if (direction === 'down') y = -32;
      if (direction === 'left') x = 32;
      if (direction === 'right') x = -32;
      return {
        hidden: { opacity: 0, x, y },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
      };
    case 'scale':
      return {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
      };
    case 'fade':
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
      };
  }
};

const AnimatedBlock: React.FC<AnimatedBlockProps> = ({
  children,
  delay = 0,
  effect = 'slide',
  direction = 'up',
  threshold = 0.18,
  style = {},
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: threshold }}
    variants={getVariants(effect, direction)}
    transition={{ delay }}
    style={{ width: '100%', ...style }}
  >
    {children}
  </motion.div>
);

export default AnimatedBlock;
