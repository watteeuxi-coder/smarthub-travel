import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
    Plane, ArrowRight, Clock, TrendingDown, Filter,
    ChevronDown, MapPin, Check, AlertCircle
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import FlightMap from '../components/FlightMap'
import StarRating from '../components/StarRating'

export default function ResultsPage() {
    const [searchParams] = useSearchParams()
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('date')
    const { t } = useLanguage()

    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sortBy, setSortBy] = useState('recommended')
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        if (from && to) {
            fetchResults()
        }
    }, [from, to, date])

    const fetchResults = async () => {
        setLoading(true)
        setError(null)
        try {
            const url = new URL('/api/search', window.location.origin)
            url.searchParams.append('from', from)
            url.searchParams.append('to', to)
            if (date) url.searchParams.append('date', date)

            console.log('🔍 Fetching results for:', { from, to, date });
            const response = await fetch(url)
            const data = await response.json()
            console.log('📦 API Response:', data);

            if (data.success) {
                console.log('✅ Success! Results:', data.data);
                setResults(data.data)
            } else {
                console.log('❌ API returned success:false', data.error);
                setError(data.error || 'No routes found')
            }
        } catch (err) {
            console.error('🚨 Fetch error:', err);
            setError('Failed to fetch routes. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const formatDuration = (mins) => {
        const hours = Math.floor(mins / 60)
        const minutes = mins % 60
        return `${hours}h ${minutes}m`
    }

    const sortedHubRoutes = useMemo(() => {
        if (!results?.hubRoutes) return []

        const routes = [...results.hubRoutes]
        switch (sortBy) {
            case 'price':
                return routes.sort((a, b) => a.price - b.price)
            case 'rating':
                return routes.sort((a, b) => (b.hubRating || 0) - (a.hubRating || 0))
            case 'savings':
                return routes.sort((a, b) => (b.savingsPercent || 0) - (a.savingsPercent || 0))
            case 'recommended':
            default:
                return routes.sort((a, b) => (b.score || 0) - (a.score || 0))
        }
    }, [results?.hubRoutes, sortBy])

    const ResultCardSkeleton = () => (
        <div className="card p-6 animate-pulse-subtle">
            <div className="h-6 w-1/3 bg-dark-700/50 rounded mb-4" />
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-24 bg-dark-700/50 rounded" />
                    <div className="h-4 w-32 bg-dark-700/50 rounded" />
                </div>
                <div className="h-6 w-40 bg-dark-700/50 rounded" />
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-10 w-64 bg-dark-800 rounded-lg mb-8 animate-pulse-subtle" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="card h-48 animate-pulse-subtle bg-dark-800/50" />
                            <div className="card h-64 animate-pulse-subtle bg-dark-800/50" />
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <ResultCardSkeleton />
                            {[1, 2, 3].map(i => <ResultCardSkeleton key={i} />)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Show friendly error screen if no results, error, or no hub routes available
    const hasNoValidResults = error || !results || (!results.directRoute && (!results.hubRoutes || results.hubRoutes.length === 0));

    if (hasNoValidResults) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-2xl animate-slide-up px-4">
                    <div className="mb-6">
                        <Plane className="w-16 h-16 text-primary-400 mx-auto mb-4 animate-pulse-subtle" />
                        <h2 className="text-2xl font-display font-semibold text-white mb-3">
                            {t('results.noResults') || 'Aucun résultat pour cette recherche'}
                        </h2>
                        <p className="text-dark-300 mb-2">
                            {t('results.noResultsDesc') || 'Nous explorons constamment de nouvelles routes pour vous offrir les meilleures économies.'}
                        </p>
                        {error && (
                            <p className="text-sm text-dark-400 italic mt-2">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            {t('results.tryPopular') || 'Essayez ces destinations populaires :'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { from: 'CDG', to: 'BKK', label: 'Paris → Bangkok', savings: '45%' },
                                { from: 'JFK', to: 'BKK', label: 'New York → Bangkok', savings: '40%' },
                                { from: 'LHR', to: 'SYD', label: 'Londres → Sydney', savings: '38%' },
                                { from: 'CDG', to: 'SYD', label: 'Paris → Sydney', savings: '42%' },
                            ].map((route) => {
                                const searchDate = new Date().toISOString().split('T')[0].split('-').reverse().join('/')
                                return (
                                    <Link
                                        key={`${route.from}-${route.to}`}
                                        to={`/results?from=${route.from}&to=${route.to}&date=${searchDate}`}
                                        className="p-4 bg-dark-800/50 border border-dark-700 rounded-xl hover:border-primary-500/50 hover:bg-dark-700/50 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-medium group-hover:text-primary-400 transition-colors">
                                                {route.label}
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-primary-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <TrendingDown className="w-4 h-4 text-accent-400" />
                                            <span className="text-accent-400 font-semibold">{route.savings}</span>
                                            <span className="text-dark-400">{t('results.savings') || 'd\'économies'}</span>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <Link to="/" className="btn-primary">
                            {t('results.searchAgain') || 'Nouvelle recherche'}
                        </Link>
                        <Link to="/hubs" className="btn-secondary">
                            {t('results.viewHubs') || 'Voir les hubs'}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }



    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-dark-400 mb-2">
                        <span className="text-white font-semibold text-sm sm:text-base">{results.origin?.city}</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-white font-semibold text-sm sm:text-base">{results.destination?.city}</span>
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                        {t('results.title')}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                        {/* Filters */}
                        <div className="card p-6">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-primary-400" />
                                    <h3 className="font-display font-semibold text-white">
                                        {t('results.filters')}
                                    </h3>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-dark-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </div>

                            {showFilters && (
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <label className="block text-sm text-dark-400 mb-2">
                                            {t('results.sortBy')}
                                        </label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="input-field cursor-pointer"
                                        >
                                            <option value="recommended" className="bg-dark-900">{t('results.recommended')}</option>
                                            <option value="price" className="bg-dark-900">{t('results.price')}</option>
                                            <option value="rating" className="bg-dark-900">{t('results.hubRating')}</option>
                                            <option value="savings" className="bg-dark-900">{t('results.savingsPercent')}</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Best Savings Summary */}
                        {results.bestRecommendation && (
                            <div className="card p-6 border-accent-500/30 bg-accent-500/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingDown className="w-5 h-5 text-accent-400" />
                                    <h3 className="font-display font-semibold text-white">{t('results.bestSavings')}</h3>
                                </div>
                                <div className="text-4xl font-display font-bold text-accent-400 mb-2">
                                    ${results.potentialSavings}
                                </div>
                                <p className="text-dark-400 text-sm">
                                    {t('results.save')} {results.bestRecommendation.savingsPercent}% {t('common.via')} {results.bestRecommendation.hubInfo?.city}
                                </p>
                            </div>
                        )}

                        {/* Map */}
                        <div className="card overflow-hidden">
                            <FlightMap
                                origin={results.origin}
                                destination={results.destination}
                                hubRoutes={results.hubRoutes}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Direct Flight Card */}
                        {results.directRoute && (
                            <div className="card p-6 animate-slide-up opacity-0 [animation-fill-mode:forwards]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Plane className="w-5 h-5 text-primary-400" />
                                        <h3 className="font-display font-semibold text-white">
                                            {t('results.directFlight')}
                                        </h3>
                                    </div>
                                    <span className="text-dark-400 text-sm">{t('results.baseline')}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-2xl font-bold text-white">
                                                ${results.directRoute.price}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-dark-400">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDuration(results.directRoute.duration)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-dark-400">
                                        <span>{results.origin?.id}</span>
                                        <ArrowRight className="w-4 h-4" />
                                        <span>{results.destination?.id}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hub Routes */}
                        <div className="space-y-4">
                            <h3 className="font-display font-semibold text-white flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-accent-400" />
                                {t('results.hubRoute')}s ({sortedHubRoutes.length})
                            </h3>

                            {sortedHubRoutes.map((route, index) => (
                                <div
                                    key={route.via}
                                    className={`card-hover p-6 animate-slide-up opacity-0 [animation-fill-mode:forwards] animate-stagger-${(index % 5) + 1} ${index === 0 ? 'border-accent-500/30 ring-1 ring-accent-500/20' : ''}`}
                                >
                                    {index === 0 && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <Check className="w-4 h-4 text-accent-400" />
                                            <span className="text-sm font-medium text-accent-400">{t('results.recommended')}</span>
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Route Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 text-white mb-2">
                                                <span>{results.origin?.id}</span>
                                                <ArrowRight className="w-4 h-4 text-dark-500" />
                                                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                                                    {route.via}
                                                </span>
                                                <ArrowRight className="w-4 h-4 text-dark-500" />
                                                <span>{results.destination?.id}</span>
                                            </div>
                                            <p className="text-dark-400 text-sm">
                                                {t('common.via')} {route.hubInfo?.name}, {route.hubInfo?.city}
                                            </p>
                                        </div>

                                        {/* Price & Stats */}
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-white">${route.price}</p>
                                                <div className="savings-badge mt-1">
                                                    <TrendingDown className="w-3 h-3 mr-1" />
                                                    {t('results.save')} ${route.savings} ({route.savingsPercent}%)
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 text-sm text-dark-400">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatDuration(route.duration)}</span>
                                                </div>
                                                <div className="hub-rating">
                                                    <StarRating
                                                        savingsPercent={route.savingsPercent || 0}
                                                        size="sm"
                                                        showValue={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* View Hub Details */}
                                    <div className="mt-4 pt-4 border-t border-dark-700/50 flex justify-end">
                                        <Link
                                            to={`/hub/${route.via}?from=${from}&to=${to}`}
                                            className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                                        >
                                            {t('results.viewDetails')}
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
