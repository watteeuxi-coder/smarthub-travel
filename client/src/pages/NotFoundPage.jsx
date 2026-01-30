import { Link } from 'react-router-dom'
import { Home, Plane, Search } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import SEOHead from '../components/SEOHead'

export default function NotFoundPage() {
    const { t } = useLanguage()

    return (
        <>
            <SEOHead
                title="Page Not Found"
                description="The page you are looking for could not be found."
            />
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-2xl animate-slide-up">
                    {/* Animated Plane Icon */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-primary-500/20 rounded-full blur-3xl animate-pulse-subtle" />
                        </div>
                        <Plane className="w-24 h-24 text-primary-400 mx-auto relative animate-bounce-slow" />
                    </div>

                    {/* 404 Text */}
                    <h1 className="font-display text-9xl font-bold text-gradient mb-4">404</h1>

                    <h2 className="font-display text-3xl font-bold text-white mb-4">
                        {t('notFound.title') || 'Oops! Flight Route Not Found'}
                    </h2>

                    <p className="text-xl text-dark-300 mb-8 max-w-md mx-auto">
                        {t('notFound.description') || 'It looks like this page took a detour. Let\'s get you back on track!'}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="btn-primary inline-flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            <span>{t('notFound.backHome') || 'Back to Home'}</span>
                        </Link>

                        <Link
                            to="/hubs"
                            className="btn-outline inline-flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            <span>{t('notFound.exploreHubs') || 'Explore Hubs'}</span>
                        </Link>
                    </div>

                    {/* Popular Routes */}
                    <div className="mt-12 pt-8 border-t border-dark-700/50">
                        <p className="text-dark-400 mb-4">{t('notFound.popular') || 'Popular Routes:'}</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {[
                                { from: 'CDG', to: 'BKK', label: 'Paris → Bangkok' },
                                { from: 'JFK', to: 'SYD', label: 'New York → Sydney' },
                                { from: 'LHR', to: 'DXB', label: 'London → Dubai' }
                            ].map(route => (
                                <Link
                                    key={`${route.from}-${route.to}`}
                                    to={`/results?from=${route.from}&to=${route.to}&date=${new Date().toISOString().split('T')[0]}`}
                                    className="px-4 py-2 bg-dark-800/50 border border-dark-700 rounded-full text-sm text-dark-300 hover:border-primary-500/50 hover:text-primary-400 transition-all"
                                >
                                    {route.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
