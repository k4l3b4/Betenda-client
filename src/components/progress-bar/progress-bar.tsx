// src/components/Progress.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type GradientOptions = {
  [key: string]: string;
};

const predefinedGradients: GradientOptions = {
  gradient1: '#fe5196, #f77062',
  gradient2: '#6EE7B7, #3B82F6',
  gradient3: '#F59E0B, #D97706',
  gradient4: '#F472B6, #C084FC',
  gradient5: '#10B981, #3B82F6',
  gradient6: '#EC4899, #D97706',
  gradient7: '#F472B6, #34D399',
  gradient8: '#EF4444, #6EE7B7',
  gradient9: '#F87171, #7F9CF5',
  gradient10: '#F59E0B, #F472B6',
};

interface ProgressProps extends React.HTMLProps<HTMLDivElement> {
  current: number;
  end: number;
  gradient: 'gradient1' | 'gradient2' | 'gradient3' | 'gradient4' | 'gradient5' | 'gradient6' | 'gradient7' | 'gradient8' | 'gradient9' | 'gradient10' | string;
}

const Progress: React.FC<ProgressProps> = ({ current, gradient, end, ...rest }) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setProgress(current);
  }, [current]);
  const selectedGradient = predefinedGradients[gradient] || gradient;
  return (
    <div className="w-full h-5 bg-background rounded-lg overflow-hidden" {...rest}>
      <motion.div
        className="h-full"
        style={{ background: `linear-gradient(90deg, ${selectedGradient}` }}
        initial={{ width: 0 }}
        animate={{ width: `${(progress / end) * 100}%` }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      ></motion.div>
    </div>
  );
};
export default Progress;
