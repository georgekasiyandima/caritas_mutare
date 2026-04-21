import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const countRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const endValue = parseInt(String(end).replace(/[^\d]/g, ''), 10);

  useEffect(() => {
    hasStartedRef.current = false;
    setCount(0);
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [end, duration]);

  const startCountUp = useCallback(() => {
    if (!Number.isFinite(endValue) || endValue < 0) {
      setCount(0);
      onComplete?.();
      return;
    }

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

      setCount(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
        setCount(endValue);
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [duration, endValue, onComplete]);

  useEffect(() => {
    const el = countRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStartedRef.current) return;
        hasStartedRef.current = true;
        startCountUp();
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [startCountUp]);

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
        {prefix}
        {Number.isFinite(endValue) ? formatNumber(count) : String(end)}
        {suffix}
      </Typography>
    </div>
  );
};

export default CountUpAnimation;
