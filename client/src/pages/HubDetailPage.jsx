import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import {
    TrendingDown, ArrowLeft, Plane, MapPin,
    Wifi, Coffee, ShoppingBag, Sparkles, Check,
    Clock, Info, Star, MessageSquare, ChevronDown
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import StarRating, { calculateStarRating } from '../components/StarRating'

import { getHubImage } from '../constants/hubImages'
import FlightMap from '../components/FlightMap'

export default function HubDetailPage() {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const fromId = searchParams.get('from')
    const toId = searchParams.get('to')

    const [hub, setHub] = useState(null)
    const [airports, setAirports] = useState([])
    const [loading, setLoading] = useState(true)
    const [showWhyHub, setShowWhyHub] = useState(false)
    const { t } = useLanguage()

    useEffect(() => {
        fetchHubDetails()
        fetchAirports()
    }, [id])

    const fetchAirports = async () => {
        try {
            const response = await fetch('/api/airports')
            const data = await response.json()
            if (data.success) {
                setAirports(data.data)
            }
        } catch (err) {
            console.error('Failed to fetch airports:', err)
        }
    }

    const fetchHubDetails = async () => {
        try {
            const response = await fetch(`/api/hub/${id}`)
            const data = await response.json()
            if (data.success) {
                setHub(data.data)
            }
        } catch (err) {
            console.error('Failed to fetch hub details:', err)
        } finally {
            setLoading(false)
        }
    }



    const getFeatureIcon = (feature) => {
        const iconMap = {
            'wifi': Wifi,
            'lounge': Coffee,
            'shopping': ShoppingBag,
            'default': Sparkles,
        }

        const key = Object.keys(iconMap).find(k =>
            feature.toLowerCase().includes(k)
        ) || 'default'

        return iconMap[key]
    }


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

    if (!hub) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-display font-semibold text-white mb-4">
                        {t('hubDetail.notFound')}
                    </h2>
                    <Link to="/hubs" className="btn-primary">
                        {t('hubDetail.viewAllHubs')}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    to="/hubs"
                    className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t('hubDetail.backToHubs')}
                </Link>

                {/* Header */}
                <div className="card overflow-hidden mb-8">
                    <div className="h-48 md:h-64 relative overflow-hidden">
                        <img
                            src={getHubImage(hub.id)}
                            alt={hub.name}
                            className="w-full h-full object-cover animate-slow-zoom"
                            onError={(e) => {
                                e.target.src = '/assets/hubs/generic_plane.png'
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

                        <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 backdrop-blur-md border border-primary-500/20 rounded-full text-primary-300 text-sm mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span>{hub.city}, {hub.country}</span>
                                </div>
                                <h1 className="font-display text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                                    {hub.name}
                                </h1>
                            </div>
                            <div className="hidden md:block">
                                <span className="text-8xl font-display font-bold text-white/10 select-none">
                                    {hub.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:gap-6 p-6">
                        {/* Rating - Dynamic based on savings */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-dark-500 font-medium uppercase tracking-wider">{t('topHub.avgSavings')}</span>
                            <div className="flex items-center gap-2">
                                <StarRating
                                    savingsPercent={hub.priceStats?.avgSavingsPercent || hub.avgSavings || 0}
                                    size="md"
                                    showValue={false}
                                />
                                <span className="text-xl font-bold text-white leading-none">
                                    {calculateStarRating(hub.priceStats?.avgSavingsPercent || hub.avgSavings || 0)}
                                </span>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-dark-700 hidden md:block" />

                        {/* Average Savings */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-dark-500 font-medium uppercase tracking-wider">{t('topHub.maxSavings')}</span>
                            <div className="flex items-center gap-2 text-accent-400">
                                <TrendingDown className="w-5 h-5" />
                                <span className="text-xl font-bold leading-none">
                                    {hub.avgSavings}%
                                </span>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-dark-700 hidden md:block" />

                        {/* Layover */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-dark-500 font-medium uppercase tracking-wider">{t('topHub.avgLayover')}</span>
                            <div className="flex items-center gap-2 text-primary-400">
                                <Clock className="w-5 h-5" />
                                <span className="text-xl font-bold leading-none">
                                    {hub.avgLayover || '3-4h'}
                                </span>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-dark-700 hidden md:block" />

                        {/* Total Flights */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-dark-500 font-medium uppercase tracking-wider">{t('topHub.totalFlights')}</span>
                            <div className="flex items-center gap-2 text-white">
                                <Plane className="w-5 h-5 text-dark-400" />
                                <span className="text-xl font-bold leading-none">
                                    {hub.totalFlights || '500+'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    {(hub.description || t(`hubDescriptions.${hub.id}`)) && (
                        <div className="card p-6">
                            <h2 className="font-display text-xl font-semibold text-white mb-4">
                                {t('hubDetail.aboutHub')}
                            </h2>
                            <p className="text-dark-300 leading-relaxed text-sm">
                                {t(`hubDescriptions.${hub.id}`, hub.description)}
                            </p>
                        </div>
                    )}

                    {/* Hub Highlight & Why this Hub */}
                    <div className="card p-6 border-primary-500/20 bg-primary-500/5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="p-3 bg-primary-500/20 rounded-xl">
                                <Sparkles className="w-6 h-6 text-primary-400" />
                            </div>
                            <button
                                onClick={() => setShowWhyHub(!showWhyHub)}
                                className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
                            >
                                <Info className="w-4 h-4" />
                                {t('topHub.whyThisHub')}
                                <ChevronDown className={`w-4 h-4 transition-transform ${showWhyHub ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        <h2 className="text-lg font-display font-bold text-white mb-2">
                            {t('topHub.hubHighlight')}
                        </h2>
                        <p className="text-base text-primary-200 font-medium mb-4">
                            {t(`hubShortSummaries.${hub.id}`, hub.shortSummary) || t(`hubDescriptions.${hub.id}`, hub.description)}
                        </p>

                        {showWhyHub && (
                            <div className="mt-6 pt-6 border-t border-primary-500/20 animate-slide-up">
                                <p className="text-dark-300 leading-relaxed mb-6 text-sm">
                                    {t(`hubDescriptions.${hub.id}`, hub.description)}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 bg-dark-900/50 rounded-xl border border-white/5">
                                        <TrendingDown className="w-5 h-5 text-accent-400 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-white mb-1 text-sm">{t('topHub.costEffectiveTitle')}</h4>
                                            <p className="text-[11px] text-dark-400 line-height-relaxed">{t('topHub.costEffectiveDesc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-dark-900/50 rounded-xl border border-white/5">
                                        <MapPin className="w-5 h-5 text-primary-400 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-white mb-1 text-sm">{t('topHub.strategicLocationTitle')}</h4>
                                            <p className="text-[11px] text-dark-400 line-height-relaxed">{t('topHub.strategicLocationDesc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reviews */}
                    {hub.reviews && hub.reviews.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="font-display text-xl font-semibold text-white flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary-400" />
                                {t('topHub.travelerReviews')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {hub.reviews.map((review, idx) => (
                                    <div key={idx} className="card p-5 bg-dark-800/50 border-dark-700/50">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-semibold text-white">{review.name}</span>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-dark-600'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-dark-300 text-sm italic leading-relaxed">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features */}
                    {hub.features && hub.features.length > 0 && (
                        <div className="card p-6">
                            <h2 className="font-display text-xl font-semibold text-white mb-6">
                                {t('hubDetail.features')}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {hub.features.map((feature, index) => {
                                    const Icon = getFeatureIcon(feature)
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-4 bg-dark-700/30 rounded-xl"
                                        >
                                            <div className="p-2 bg-primary-500/20 rounded-lg">
                                                <Icon className="w-5 h-5 text-primary-400" />
                                            </div>
                                            <span className="text-white">{t(`hubFeatures.${feature}`, feature)}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Popular Routes */}
                    {hub.popularRoutes && hub.popularRoutes.length > 0 && (
                        <div className="card p-6">
                            <h2 className="font-display text-xl font-semibold text-white mb-6">
                                {t('hubDetail.popularRoutes')}
                            </h2>
                            <div className="space-y-3">
                                {hub.popularRoutes.map((route, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-4 bg-dark-700/30 rounded-xl"
                                    >
                                        <Check className="w-5 h-5 text-accent-400" />
                                        <span className="text-dark-300">{t(`hubRoutes.${route}`, route)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Price Statistics */}
                    {hub.priceStats && (
                        <div className="card p-6">
                            <h2 className="font-display text-xl font-semibold text-white mb-6">
                                {t('hubDetail.priceStats')}
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-accent-500/10 rounded-xl">
                                    <p className="text-dark-400 text-sm mb-1">{t('hubDetail.maxSavings')}</p>
                                    <p className="text-2xl font-bold text-accent-400">
                                        ${hub.priceStats.maxSavings}
                                    </p>
                                    <p className="text-accent-400/60 text-sm">
                                        ({hub.priceStats.maxSavingsPercent}%)
                                    </p>
                                </div>

                                <div className="p-4 bg-primary-500/10 rounded-xl">
                                    <p className="text-dark-400 text-sm mb-1">{t('hubDetail.avgSavings')}</p>
                                    <p className="text-2xl font-bold text-primary-400">
                                        ${hub.priceStats.avgSavings}
                                    </p>
                                    <p className="text-primary-400/60 text-sm">
                                        ({hub.priceStats.avgSavingsPercent}%)
                                    </p>
                                </div>

                                <div className="p-4 bg-dark-700/30 rounded-xl">
                                    <p className="text-dark-400 text-sm mb-1">{t('hubDetail.routeCount')}</p>
                                    <p className="text-2xl font-bold text-white">
                                        {hub.priceStats.routeCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Location & Map */}
                    <div className="card overflow-hidden">
                        <div className="p-6 border-b border-dark-700/50">
                            <h2 className="font-display text-xl font-semibold text-white mb-2">
                                {t('hubDetail.location')}
                            </h2>
                            <div className="flex items-center gap-2 text-dark-400">
                                <MapPin className="w-5 h-5 text-primary-400" />
                                <span>{hub.city}, {hub.country}</span>
                            </div>
                        </div>
                        {hub.coords && (
                            <div className="h-80">
                                <FlightMap
                                    origin={airports.find(a => a.id === fromId) || { coords: hub.coords, name: hub.name, city: hub.city, country: hub.country }}
                                    destination={airports.find(a => a.id === toId) || { coords: hub.coords, name: hub.name, city: hub.city, country: hub.country }}
                                    hubRoutes={[{
                                        via: hub.id,
                                        hubInfo: { coords: hub.coords, name: hub.name, city: hub.city },
                                        savings: hub.avgSavings || 0
                                    }]}
                                />
                            </div>
                        )}
                        <div className="p-4 bg-dark-800/50">
                            <p className="text-dark-500 text-xs text-center">
                                {t('hubDetail.coordinates')}: {hub.coords[1]?.toFixed(2)}°N, {hub.coords[0]?.toFixed(2)}°E
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
