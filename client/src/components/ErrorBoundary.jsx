import React from 'react';
import { withTranslation } from 'react-i18next';
import { Plane } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        const { t } = this.props;

        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-dark-900 border border-red-500/20 m-4 rounded-xl">
                    <div className="text-center p-8">
                        <Plane className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
                        <h1 className="text-2xl font-display font-bold text-white mb-4">
                            {t('common.error')}
                        </h1>
                        <p className="text-dark-400 mb-6">
                            {t('results.errorFetch')}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                        >
                            {t('common.tryAgain')}
                        </button>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 text-left bg-dark-800 p-4 rounded-lg border border-dark-700 overflow-auto max-w-2xl max-h-64">
                                <details className="text-xs text-red-400 font-mono">
                                    <summary className="cursor-pointer font-semibold mb-2">Error Details</summary>
                                    <pre className="whitespace-pre-wrap">
                                        {this.state.error && this.state.error.toString()}
                                        <br />
                                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default withTranslation()(ErrorBoundary);
