import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'
import './index.css'
import './i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <ToastProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ToastProvider>
            </HelmetProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
