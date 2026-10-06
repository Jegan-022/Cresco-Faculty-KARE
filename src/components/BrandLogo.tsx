import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitleText?: string;
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  subtitleText = 'FACULTY PORTAL • CS-4200',
  className = '',
}) => {
  const iconSizeClass = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  }[size];

  const titleSizeClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  const subSizeClass = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  }[size];

  return (
    <div
      className={`flex items-center gap-2.5 select-none ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
    >
      <div
        className={`${iconSizeClass} relative shrink-0 flex items-center justify-center`}
        style={{
          width: size === 'sm' ? '32px' : size === 'lg' ? '56px' : '44px',
          height: size === 'sm' ? '32px' : size === 'lg' ? '56px' : '44px',
          position: 'relative',
        }}
      >
        <img
          src="/assets/mascot/cresco-mascot.png"
          alt="Cresco CN Mascot Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 8px rgba(6, 182, 212, 0.45))',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          className={`font-headline ${titleSizeClass}`}
          style={{
            fontWeight: 900,
            letterSpacing: '-0.03em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>CRESCO</span>
          <span style={{ color: '#06B6D4' }}>CN</span>
        </span>
        {showSubtitle && (
          <span
            className={`font-mono ${subSizeClass}`}
            style={{
              color: '#0891b2',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: '4px',
            }}
          >
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
