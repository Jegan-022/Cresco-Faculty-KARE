import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cresco-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('cresco-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('cresco-theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark(!isDark)}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle visual theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '54px',
        height: '30px',
        borderRadius: '9999px',
        padding: '3px',
        backgroundColor: isDark ? '#16362a' : '#dcfce7',
        border: `1px solid ${isDark ? '#1a4334' : '#bbf7d0'}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 200ms ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '22px',
          height: '22px',
          borderRadius: '9999px',
          backgroundColor: isDark ? '#10b981' : '#ffffff',
          color: isDark ? '#06100c' : '#f59e0b',
          transform: isDark ? 'translateX(24px)' : 'translateX(0)',
          transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }}
      >
        {isDark ? <Moon size={13} strokeWidth={2.5} /> : <Sun size={13} strokeWidth={2.5} />}
      </div>
      <div
        style={{
          position: 'absolute',
          right: isDark ? 'auto' : '8px',
          left: isDark ? '8px' : 'auto',
          fontSize: '10px',
          fontWeight: 700,
          color: isDark ? '#6ee7b7' : '#15803d',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {isDark ? '☾' : '☼'}
      </div>
    </button>
  );
};
