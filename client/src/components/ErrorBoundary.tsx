import React from 'react';
import { GraduationCap, RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

function ErrorFallbackUI({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center px-4 gap-5">
      <div className="w-20 h-20 rounded-lg bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center shadow-soft-md">
        <AlertTriangle className="w-10 h-10 text-rose-500" />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">Application Error</p>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
          An unexpected error occurred in the EduConnect portal. Your data is safe — please try refreshing or go back to the dashboard.
        </p>
        {error && (
          <details className="mt-4 text-left max-w-md mx-auto">
            <summary className="text-xs font-mono text-slate-400 cursor-pointer hover:text-slate-500">
              Error details
            </summary>
            <pre className="mt-2 text-[10px] text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-lg p-3 overflow-auto max-h-32 border border-rose-200 dark:border-rose-900">
              {error.message}
            </pre>
          </details>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-soft-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <button
          onClick={() => {
            onReset();
            window.location.href = '/';
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <GraduationCap className="w-4 h-4" />
          Back to Portal Home
        </button>
      </div>
    </div>
  );
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[EduConnect ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallbackUI
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}
