import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, X, Loader2 } from 'lucide-react'
import { searchLocations } from '../services/api'

export default function AirportAutocomplete({
    value,
    onChange,
    placeholder,
    airports,
    icon: Icon = MapPin
}) {
    const [searchTerm, setSearchTerm] = useState(value)
    const [isOpen, setIsOpen] = useState(false)
    const [filteredAirports, setFilteredAirports] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [isLoading, setIsLoading] = useState(false)
    const wrapperRef = useRef(null)
    const debounceTimerRef = useRef(null)

    // Debounced search effect
    useEffect(() => {
        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        if (searchTerm && searchTerm.trim().length >= 2) {
            setIsLoading(true)

            // Set new timer for debounce
            debounceTimerRef.current = setTimeout(async () => {
                try {
                    const response = await searchLocations(searchTerm)
                    if (response.success) {
                        setFilteredAirports(response.data)
                        setIsOpen(response.data.length > 0)
                    }
                } catch (error) {
                    console.error('Airport search failed:', error)
                    // Fallback to local search if API fails
                    const term = searchTerm.toLowerCase()
                    const filtered = airports.filter(airport =>
                        airport.id.toLowerCase().includes(term) ||
                        airport.name.toLowerCase().includes(term) ||
                        airport.city.toLowerCase().includes(term) ||
                        airport.country.toLowerCase().includes(term)
                    ).slice(0, 8)
                    setFilteredAirports(filtered)
                    setIsOpen(filtered.length > 0)
                } finally {
                    setIsLoading(false)
                }
            }, 300) // 300ms debounce
        } else {
            setFilteredAirports([])
            setIsOpen(false)
            setIsLoading(false)
        }

        // Cleanup on unmount
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [searchTerm, airports])

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])


    const handleSelect = (airport) => {
        setSearchTerm(airport.id)
        onChange(airport.id)
        setIsOpen(false)
        setSelectedIndex(-1)
    }

    const handleKeyDown = (e) => {
        if (!isOpen) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev =>
                    prev < filteredAirports.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0 && filteredAirports[selectedIndex]) {
                    handleSelect(filteredAirports[selectedIndex])
                }
                break
            case 'Escape':
                setIsOpen(false)
                setSelectedIndex(-1)
                break
        }
    }

    const handleClear = () => {
        setSearchTerm('')
        onChange('')
        setIsOpen(false)
    }

    return (
        <div ref={wrapperRef} className="relative flex-1">
            <label className="relative group cursor-text">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 group-focus-within:text-primary-400 transition-colors pointer-events-none z-10" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        onChange(e.target.value)
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchTerm && setIsOpen(filteredAirports.length > 0)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-10 py-4 bg-dark-700/50 border border-dark-600 rounded-2xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                />
                {isLoading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 animate-spin z-10" />
                )}
                {!isLoading && searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </label>

            {isOpen && filteredAirports.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-60 sm:max-h-80 overflow-y-auto">
                    {filteredAirports.map((airport, index) => (
                        <button
                            key={airport.id}
                            type="button"
                            onClick={() => handleSelect(airport)}
                            className={`w-full text-left px-4 py-3 hover:bg-dark-700 transition-colors border-b border-dark-700/50 last:border-0 ${index === selectedIndex ? 'bg-dark-700' : ''
                                }`}
                        >
                            <div className="flex items-start sm:items-center justify-between gap-2">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono font-bold text-primary-400 text-sm sm:text-base">{airport.id}</span>
                                        <span className="text-white font-medium text-sm sm:text-base">{airport.name}</span>
                                    </div>
                                    <div className="text-sm text-dark-400 mt-1">
                                        {airport.city}, {airport.country}
                                    </div>
                                </div>
                                {airport.isHub && (
                                    <span className="px-2 py-1 bg-accent-500/20 text-accent-400 rounded-lg text-xs font-medium">
                                        Hub
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
