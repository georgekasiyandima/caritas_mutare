import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@mui/material';

interface CountUpAnimationProps {
  end: number | string;
  duration?: number;
  suffix?: string;
  prefix?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  color?: string;
  fontWeight?: number | string;
  onComplete?: () => void;
}

const CountUpAnimation: React.FC<CountUpAnimationProps> = ({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  variant = 'h4',
  color = 'primary',
  fontWeight = 'bold',
  onComplete,
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          startCountUp();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [isVisible]);

  const startCountUp = () => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = parseInt(String(end).replace(/[^\d]/g, ''));

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
        if (onComplete) {
          onComplete();
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const formatNumber = (num: number): string => {
    const originalEnd = end.toString();
    const hasPlus = originalEnd.includes('+');
    const hasComma = originalEnd.includes(',');
    
    if (hasPlus) {
      return num.toLocaleString() + '+';
    }
    
    if (hasComma) {
      return num.toLocaleString();
    }
    
    return num.toString();
  };

  return (
    <div ref={countRef}>
      <Typography
        variant={variant}
        sx={{
          color,
          fontWeight,
          fontFamily: 'monospace',
          letterSpacing: '0.02em',
        }}
      >
        {prefix}{formatNumber(count)}{suffix}
      </Typography>
    </div>
  );
};

export default CountUpAnimation;
