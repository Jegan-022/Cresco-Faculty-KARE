import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  badgeText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  badgeText = 'AWAITING DATA SYNC',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`card-standard ${className}`}
      role="region"
      aria-label={title}
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed var(--border)',
        backgroundColor: 'var(--surface-container-low)',
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Status Chip */}
      {badgeText && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '9999px',
            backgroundColor: 'var(--surface-container)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            letterSpacing: '0.08em',
            marginBottom: '18px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '9999px',
              backgroundColor: '#f59e0b',
            }}
          />
          {badgeText}
        </span>
      )}

      {/* Icon Container with Frosted Glow */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          backgroundColor: 'var(--surface-container)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.18)',
          marginBottom: '16px',
        }}
      >
        <Icon size={28} strokeWidth={1.8} />
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '18px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '8px',
          maxWidth: '420px',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          maxWidth: '460px',
          marginBottom: actionText ? '24px' : '0',
        }}
      >
        {description}
      </p>

      {/* Action Buttons */}
      {(actionText || secondaryActionText) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {actionText && (
            <button
              type="button"
              onClick={onAction}
              className="btn-tactile-primary"
              style={{ fontSize: '13px', padding: '10px 20px' }}
            >
              {actionText}
            </button>
          )}
          {secondaryActionText && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="btn-outline"
              style={{ fontSize: '13px', padding: '9px 18px' }}
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
