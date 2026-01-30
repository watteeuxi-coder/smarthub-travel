import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id))
        }, 5000)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

function Toast({ message, type, onClose }) {
    const icons = {
        success: CheckCircle,
        error: XCircle,
        info: Info
    }

    const colors = {
        success: 'bg-accent-500/90 border-accent-400',
        error: 'bg-red-500/90 border-red-400',
        info: 'bg-primary-500/90 border-primary-400'
    }

    const Icon = icons[type]

    return (
        <div className={`${colors[type]} backdrop-blur-lg border text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] animate-slide-in-right`}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}
