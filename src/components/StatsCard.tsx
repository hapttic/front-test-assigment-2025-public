import { useEffect, useState } from 'react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: number;
  format?: 'number' | 'currency' | 'percentage';
  trend?: number; // percentage change
  icon: 'revenue' | 'clicks' | 'impressions' | 'rate' | 'campaign';
  delay?: number;
}

export function StatsCard({ title, value, format = 'number', trend, icon, delay = 0 }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animated counter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1000; // 1 second
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      
      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      case 'percentage':
        return val.toFixed(2) + '%';
      case 'number':
      default:
        return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'revenue':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
      case 'clicks':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        );
      case 'impressions':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case 'rate':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        );
      case 'campaign':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
    }
  };

  return (
    <div className={`stats-card stats-card-${icon} ${isVisible ? 'visible' : ''}`}>
      <div className="stats-card-icon">{getIcon()}</div>
      <div className="stats-card-content">
        <div className="stats-card-title">{title}</div>
        <div className="stats-card-value">{formatValue(displayValue)}</div>
        {trend !== undefined && (
          <div className={`stats-card-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
            <span className="trend-icon">{trend >= 0 ? '↑' : '↓'}</span>
            <span className="trend-value">{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

