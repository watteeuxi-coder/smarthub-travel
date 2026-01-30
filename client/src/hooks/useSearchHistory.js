import { useState, useEffect } from 'react'

const STORAGE_KEY = 'smarthub_search_history'
const MAX_HISTORY = 5

export function useSearchHistory() {
    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
        } catch (error) {
            console.error('Failed to save search history:', error)
        }
    }, [history])

    const addSearch = (from, to, date) => {
        const search = {
            from,
            to,
            date: date || new Date().toISOString().split('T')[0],
            timestamp: Date.now()
        }

        setHistory(prev => {
            const filtered = prev.filter(s => !(s.from === from && s.to === to))
            return [search, ...filtered].slice(0, MAX_HISTORY)
        })
    }

    const clearHistory = () => {
        setHistory([])
    }

    return { history, addSearch, clearHistory }
}
