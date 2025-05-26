import React from 'react';
import StyledCard from '../atoms/StyledCard';
import styles from './StatsCard.module.scss';

/**
 * A reusable stats card molecule component.
 * Displays statistical information in a consistent format.
 *
 * Props:
 * - title: string - The title/label for the stat
 * - value: number|string - The statistical value to display
 * - icon: string - Material icon name (optional)
 * - trend: object - { value: number, direction: 'up'|'down'|'neutral' } (optional)
 * - variant: 'default', 'primary', 'success', 'warning', 'danger' (default: 'default')
 * - size: 'sm', 'md', 'lg' (default: 'md')
 * - className: Additional CSS classes
 */
const StatsCard = ({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const cardClass = styles[`stats-${variant}`] || styles['stats-default'];
  const sizeClass = styles[`size-${size}`] || styles['size-md'];

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'up':
        return 'trending_up';
      case 'down':
        return 'trending_down';
      default:
        return 'trending_flat';
    }
  };

  const getTrendClass = (direction) => {
    switch (direction) {
      case 'up':
        return styles.trendUp;
      case 'down':
        return styles.trendDown;
      default:
        return styles.trendNeutral;
    }
  };

  return (
    <StyledCard 
      variant="stats"
      className={`${styles.statsCard} ${cardClass} ${sizeClass} ${className}`}
      {...props}
    >
      <div className={styles.statsContent}>
        {icon && (
          <div className={styles.statsIcon}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
        )}
        
        <div className={styles.statsData}>
          <div className={styles.statsValue}>
            {formatValue(value)}
          </div>
          
          <div className={styles.statsTitle}>
            {title}
          </div>
          
          {trend && (
            <div className={`${styles.statsTrend} ${getTrendClass(trend.direction)}`}>
              <span className="material-symbols-outlined">
                {getTrendIcon(trend.direction)}
              </span>
              <span className={styles.trendValue}>
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </StyledCard>
  );
};

export default StatsCard;
