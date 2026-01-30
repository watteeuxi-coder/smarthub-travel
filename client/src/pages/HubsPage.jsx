import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingDown, ArrowRight, Plane, MapPin, Heart, Filter } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useFavorites } from '../hooks/useFavorites'
import StarRating from '../components/StarRating'
import SEOHead from '../components/SEOHead'
import { useToast } from '../components/Toast'
import flightData from '../data/data.json'

import { getHubImage } from '../constants/hubImages'

export default function HubsPage() {
    const [hubs, setHubs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
    const { t } = useLanguage()
    const { favorites, isFavorite, toggleFavorite } = useFavorites()
    const { addToast } = useToast()

    useEffect(() => {
        loadHubs()
    }, [])

    const loadHubs = () => {
        try {
            // Get unique hub airports from static data
            const hubAirports = flightData.airports.filter(airport => airport.isHub)

            // Calculate savings and routes for each hub
            const rankedHubs = hubAirports.map(hub => {
                const hubRoutes = flightData.routes.filter(route => route.hub === hub.id)
                const avgSavings = hubRoutes.length > 0
                    ? hubRoutes.reduce((sum, r) => sum + r.savings, 0) / hubRoutes.length
                    : 0

                return {
                    ...hub,
                    avgSavings: Math.round(avgSavings),
                    routeCount: hubRoutes.length,
                    rating: hub.rating || 4.5
                }
            }).sort((a, b) => b.avgSavings - a.avgSavings)

            setHubs(rankedHubs)
        } catch (err) {
            console.error('Failed to load hubs:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleFavorite = (e, hubId) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(hubId)
        const isFav = isFavorite(hubId)
        addToast(
            isFav ? t('hubs.removedFromFavorites') || 'Removed from favorites' : t('hubs.addedToFavorites') || 'Added to favorites',
            'success'
        )
    }

    const filteredHubs = showOnlyFavorites
        ? hubs.filter(hub => isFavorite(hub.id))
        : hubs



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Plane className="w-12 h-12 text-primary-400 animate-bounce mx-auto mb-4" />
                    <p className="text-dark-300">{t('common.loading')}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <SEOHead
                title="Top International Flight Hubs"
                description="Discover the world's best airport hubs for connecting flights. Compare savings, amenities, and transit experiences at major international airports."
                keywords="airport hubs, connecting flights, cheap flights, international airports, flight savings"
            />
            <div className="min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                            {t('hubs.title')}
                        </h1>
                        <p className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-6 px-4">
                            {t('hubs.subtitle')}
                        </p>

                        {/* Favorites Filter */}
                        {favorites.length > 0 && (
                            <button
                                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                                className={`btn-outline inline-flex items-center gap-2 ${showOnlyFavorites ? 'bg-accent-500/20 border-accent-500' : ''}`}
                            >
                                <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-accent-400 text-accent-400' : ''}`} />
                                <span>{showOnlyFavorites ? t('hubs.showAll') || 'Show All' : t('hubs.showFavorites') || `Show Favorites (${favorites.length})`}</span>
                            </button>
                        )}
                    </div>

                    {/* Hub Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHubs.map((hub, index) => (
                            <div
                                key={hub.id}
                                className="card-hover overflow-hidden group relative"
                            >
                                {/* Rank Badge */}
                                {index < 3 && !showOnlyFavorites && (
                                    <div className={`absolute top-4 left-4 z-20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                                        ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-dark-900 shadow-lg'
                                        : index === 1
                                            ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-dark-900 shadow-lg'
                                            : 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg'
                                        }`}>
                                        #{index + 1}
                                    </div>
                                )}

                                {/* Favorite Button */}
                                <button
                                    onClick={(e) => handleToggleFavorite(e, hub.id)}
                                    className="absolute top-4 right-4 z-20 p-2 bg-dark-900/80 backdrop-blur-sm rounded-full hover:bg-dark-800 transition-all group/fav"
                                    title={isFavorite(hub.id) ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    <Heart className={`w-5 h-5 transition-all ${isFavorite(hub.id)
                                        ? 'fill-accent-400 text-accent-400'
                                        : 'text-dark-400 group-hover/fav:text-accent-400'
                                        }`} />
                                </button>

                                {/* Header Image */}
                                <div className="h-48 relative overflow-hidden">
                                    <img
                                        src={getHubImage(hub.id)}
                                        alt={hub.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = '/assets/hubs/generic_plane.png'
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <Plane className="w-16 h-16 text-white/10 group-hover:scale-125 transition-transform duration-500" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-display text-xl font-semibold text-white mb-1">
                                                {hub.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-dark-400 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                <span>{hub.city}, {hub.country}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-primary-400 bg-primary-500/10 px-2 py-1 rounded">
                                            {hub.id}
                                        </span>
                                    </div>

                                    {/* Rating - Dynamic based on savings */}
                                    <div className="mb-4">
                                        <StarRating savingsPercent={hub.avgSavings || 0} />
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-3 bg-accent-500/10 rounded-xl">
                                            <div className="flex items-center gap-2 text-accent-400 mb-1">
                                                <TrendingDown className="w-4 h-4" />
                                                <span className="text-xs">{t('hubs.avgSavings')}</span>
                                            </div>
                                            <p className="text-xl font-bold text-white">{hub.avgSavings}%</p>
                                        </div>
                                        <div className="p-3 bg-primary-500/10 rounded-xl">
                                            <div className="flex items-center gap-2 text-primary-400 mb-1">
                                                <Plane className="w-4 h-4" />
                                                <span className="text-xs">{t('hubs.routes')}</span>
                                            </div>
                                            <p className="text-xl font-bold text-white">{hub.routeCount || t('hubs.many')}</p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-dark-400 text-sm mb-6 line-clamp-2">
                                        {t('topHub.description')}
                                    </p>

                                    {/* CTA */}
                                    <Link
                                        to={`/hub/${hub.id}`}
                                        className="btn-outline w-full flex items-center justify-center gap-2 group-hover:bg-primary-500/10"
                                    >
                                        <span>{t('hubs.exploreHub')}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State for Favorites */}
                    {showOnlyFavorites && filteredHubs.length === 0 && (
                        <div className="text-center py-16">
                            <Heart className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {t('hubs.noFavorites') || 'No favorites yet'}
                            </h3>
                            <p className="text-dark-400 mb-6">
                                {t('hubs.noFavoritesDesc') || 'Click the heart icon on any hub to add it to your favorites'}
                            </p>
                            <button
                                onClick={() => setShowOnlyFavorites(false)}
                                className="btn-primary"
                            >
                                {t('hubs.browseHubs') || 'Browse All Hubs'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
