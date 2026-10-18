/**
 * CRESCO Production — Faculty Application Error Boundary
 *
 * Implements Step 27: Top-level and route-level fault tolerance.
 * Catches unhandled runtime crashes, prevents white-screens, and provides safe recovery.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Faculty ErrorBoundary] Uncaught runtime exception:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            className="card-standard"
            style={{
              maxWidth: '540px',
              width: '100%',
              padding: '36px',
              border: '1px solid var(--warning)',
              boxShadow: '0 20px 45px rgba(245, 158, 11, 0.12)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                color: 'var(--warning)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: 'var(--warning)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              FAULT-TOLERANT RECOVERY
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '20px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '10px',
              }}
            >
              {this.props.fallbackTitle || 'Faculty View Encountered an Issue'}
            </h1>

            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '22px',
              }}
            >
              {this.state.error?.message ||
                'An unexpected client exception occurred while rendering this view. Your session and academic records remain safe.'}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-tactile-primary interactive-scale"
                style={{ padding: '9px 18px', fontSize: '13px' }}
              >
                <RefreshCw size={14} />
                <span>Retry View</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  this.handleReset();
                  window.location.href = '/dashboard';
                }}
                className="btn-outline interactive-scale"
                style={{ padding: '9px 18px', fontSize: '13px' }}
              >
                <Home size={14} />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
