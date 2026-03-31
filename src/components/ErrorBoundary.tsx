import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-black/80 border border-red-500/30 rounded-2xl p-8 text-center backdrop-blur-xl">
            <Terminal className="mx-auto mb-6 text-red-500" size={48} />
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter uppercase">SYSTEM_FAILURE</h2>
            <p className="text-red-400/80 font-mono text-sm mb-8 leading-relaxed">
              An internal error has occurred. The neural link has been severed.
            </p>
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mb-8 text-left overflow-auto max-h-40">
              <code className="text-xs text-red-400 font-mono">
                {this.state.error?.message || 'Unknown error'}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-xl hover:bg-red-500/20 transition-all font-mono text-sm"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
