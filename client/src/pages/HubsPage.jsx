import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingDown, ArrowRight, Plane, MapPin } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import StarRating from '../components/StarRating'

import { getHubImage } from '../constants/hubImages'

export default function HubsPage() {
    const [hubs, setHubs] = useState([])
    const [loading, setLoading] = useState(true)
    const { t } = useLanguage()

    useEffect(() => {
        fetchHubs()
    }, [])

    const fetchHubs = async () => {
        try {
            const response = await fetch('/api/hubs/ranked')
            const data = await response.json()
            if (data.success) {
                setHubs(data.data)
            }
        } catch (err) {
            console.error('Failed to fetch hubs:', err)
        } finally {
            setLoading(false)
        }
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

    return (
        <div className="min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                        {t('hubs.title')}
                    </h1>
                    <p className="text-xl text-dark-400 max-w-2xl mx-auto">
                        {t('hubs.subtitle')}
                    </p>
                </div>

                {/* Hub Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hubs.map((hub, index) => (
                        <div
                            key={hub.id}
                            className="card-hover overflow-hidden group relative"
                        >
                            {/* Rank Badge */}
                            {index < 3 && (
                                <div className={`absolute top-4 left-4 z-20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-dark-900 shadow-lg'
                                    : index === 1
                                        ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-dark-900 shadow-lg'
                                        : 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg'
                                    }`}>
                                    #{index + 1}
                                </div>
                            )}

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
            </div>
        </div>
    )
}
