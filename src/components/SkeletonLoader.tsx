import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = '8px',
  style = {},
  className = '',
}) => {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--surface-container)',
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div
      className="card-standard"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
      aria-hidden="true"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="40%" height="14px" />
        <Skeleton width="28px" height="28px" borderRadius="8px" />
      </div>
      <Skeleton width="60%" height="28px" />
      <Skeleton width="80%" height="12px" />
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div
      className="card-standard"
      style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
      aria-hidden="true"
    >
      <div style={{ display: 'flex', gap: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        <Skeleton width="20%" height="14px" />
        <Skeleton width="30%" height="14px" />
        <Skeleton width="20%" height="14px" />
        <Skeleton width="30%" height="14px" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Skeleton width="20%" height="12px" />
          <Skeleton width="30%" height="12px" />
          <Skeleton width="20%" height="12px" />
          <Skeleton width="30%" height="12px" />
        </div>
      ))}
    </div>
  );
};
