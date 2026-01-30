import { useState, useEffect } from 'react'

const STORAGE_KEY = 'smarthub_favorites'

export function useFavorites() {
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
        } catch (error) {
            console.error('Failed to save favorites:', error)
        }
    }, [favorites])

    const isFavorite = (hubId) => {
        return favorites.includes(hubId)
    }

    const toggleFavorite = (hubId) => {
        setFavorites(prev => {
            if (prev.includes(hubId)) {
                return prev.filter(id => id !== hubId)
            } else {
                return [...prev, hubId]
            }
        })
    }

    const clearFavorites = () => {
        setFavorites([])
    }

    return { favorites, isFavorite, toggleFavorite, clearFavorites }
}
