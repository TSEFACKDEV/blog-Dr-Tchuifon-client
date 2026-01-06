import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  glass?: boolean;
  animated?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hoverable = false,
  onClick,
  style,
  glass = false,
  animated = true,
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = `
    ${glass ? 'glass' : 'bg-white'}
    rounded-2xl border border-gray-200
    ${paddings[padding]}
    ${hoverable ? 'card-hover cursor-pointer' : 'smooth-transition'}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
        className={baseClasses}
        onClick={onClick}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={baseClasses}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
