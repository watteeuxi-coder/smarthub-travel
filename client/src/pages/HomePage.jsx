import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plane, TrendingDown, Shield, MapPin, Star, ArrowRight, Sparkles, Calendar, Users, ChevronDown, Briefcase, Clock, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useSearchHistory } from '../hooks/useSearchHistory'
import AirportAutocomplete from '../components/AirportAutocomplete'
import SEOHead from '../components/SEOHead'
import { getAirports } from '../services/api'

export default function HomePage() {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [returnDate, setReturnDate] = useState('')
    const [tripType, setTripType] = useState('oneway')
    const [adults, setAdults] = useState(1)
    const [children, setChildren] = useState(0)
    const [cabinClass, setCabinClass] = useState('economy')
    const [showTravelers, setShowTravelers] = useState(false)
    const [showClass, setShowClass] = useState(false)
    const [airports, setAirports] = useState([])
    const [loadingAirports, setLoadingAirports] = useState(true)

    const travelerRef = useRef(null)
    const classRef = useRef(null)
    const navigate = useNavigate()
    const { t } = useLanguage()
    const { history, addSearch } = useSearchHistory()

    useEffect(() => {
        fetchAirports()
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (travelerRef.current && !travelerRef.current.contains(event.target)) {
                setShowTravelers(false)
            }
            if (classRef.current && !classRef.current.contains(event.target)) {
                setShowClass(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const fetchAirports = async () => {
        try {
            const response = await getAirports()
            if (response.success) {
                setAirports(response.data)
            }
        } catch (err) {
            console.error('Failed to fetch airports:', err)
            // Fallback to empty array - autocomplete will use API search
            setAirports([])
        } finally {
            setLoadingAirports(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (from.trim() && to.trim()) {
            const parts = date.split('-')
            const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : ''
            let query = `/results?from=${from.trim().toUpperCase()}&to=${to.trim().toUpperCase()}&date=${formattedDate}&adults=${adults}&children=${children}&class=${cabinClass}`

            if (tripType === 'roundtrip' && returnDate) {
                const rParts = returnDate.split('-')
                const formattedReturn = rParts.length === 3 ? `${rParts[2]}/${rParts[1]}/${rParts[0]}` : ''
                query += `&returnDate=${formattedReturn}`
            }

            addSearch(from.trim().toUpperCase(), to.trim().toUpperCase(), date)
            navigate(query)
        }
    }

    const quickSearches = [
        { from: 'CDG', to: 'BKK', label: t('home.quickSearch.parisBangkok') },
        { from: 'JFK', to: 'BKK', label: t('home.quickSearch.nyBangkok') },
        { from: 'LHR', to: 'SYD', label: t('home.quickSearch.londonSydney') },
        { from: 'CDG', to: 'SYD', label: t('home.quickSearch.parisSydney') },
    ]

    const features = [
        {
            icon: TrendingDown,
            title: t('home.features.save'),
            description: t('home.features.saveDesc'),
            color: 'from-accent-500 to-accent-400',
        },
        {
            icon: Shield,
            title: t('home.features.transparent'),
            description: t('home.features.transparentDesc'),
            color: 'from-primary-500 to-primary-400',
        },
        {
            icon: MapPin,
            title: t('home.features.bestHubs'),
            description: t('home.features.bestHubsDesc'),
            color: 'from-amber-500 to-amber-400',
        },
    ]

    return (
        <>
            <SEOHead />
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiMxZTQwYWYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvZz48L3N2Zz4=')] opacity-50" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                        <div className="text-center max-w-4xl mx-auto">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-8 animate-fade-in">
                                <Sparkles className="w-4 h-4 text-primary-400" />
                                <span className="text-sm font-medium text-primary-300">{t('hero.smartSavings')}</span>
                            </div>

                            {/* Headline */}
                            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                                <span className="text-white">{t('hero.title')}</span>
                                <br />
                                <span className="text-gradient">{t('hero.titleAccent')}</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-xl text-dark-300 mb-12 max-w-2xl mx-auto animate-slide-up animate-stagger-1 opacity-0 [animation-fill-mode:forwards]">
                                {t('hero.subtitle')}
                            </p>

                            {/* Search Form */}
                            <div className="max-w-5xl mx-auto mb-12 animate-slide-up animate-stagger-2 opacity-0 [animation-fill-mode:forwards]">
                                {/* Trip Type Tabs */}
                                <div className="flex gap-2 mb-4 ml-2">
                                    <button
                                        onClick={() => setTripType('oneway')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tripType === 'oneway' ? 'bg-primary-500 text-white shadow-glow-primary' : 'bg-dark-800/50 text-dark-400 hover:text-white'}`}
                                    >
                                        {t('hero.oneWay')}
                                    </button>
                                    <button
                                        onClick={() => setTripType('roundtrip')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tripType === 'roundtrip' ? 'bg-primary-500 text-white shadow-glow-primary' : 'bg-dark-800/50 text-dark-400 hover:text-white'}`}
                                    >
                                        {t('hero.roundTrip')}
                                    </button>
                                </div>

                                <form onSubmit={handleSearch} className="relative z-20">
                                    <div className="flex flex-col gap-4 p-4 bg-dark-800/60 backdrop-blur-2xl border border-dark-700/50 rounded-3xl shadow-2xl">
                                        {/* Main Row */}
                                        <div className="flex flex-col lg:flex-row gap-3">
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <AirportAutocomplete
                                                    value={from}
                                                    onChange={setFrom}
                                                    placeholder={t('hero.fromPlaceholder')}
                                                    airports={airports}
                                                    icon={Plane}
                                                />
                                                <AirportAutocomplete
                                                    value={to}
                                                    onChange={setTo}
                                                    placeholder={t('hero.toPlaceholder')}
                                                    airports={airports}
                                                    icon={MapPin}
                                                />
                                            </div>

                                            <div className={`flex-1 grid gap-3 ${tripType === 'roundtrip' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                                                <label className="relative group cursor-pointer">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 group-focus-within:text-primary-400 transition-colors pointer-events-none z-10" />
                                                    <input
                                                        type="date"
                                                        value={date}
                                                        onChange={(e) => setDate(e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        required
                                                        className="w-full pl-12 pr-4 py-4 bg-dark-700/50 border border-dark-600 rounded-2xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                                                        style={{ colorScheme: 'dark' }}
                                                    />
                                                </label>
                                                {tripType === 'roundtrip' && (
                                                    <label className="relative group cursor-pointer">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 group-focus-within:text-primary-400 transition-colors pointer-events-none z-10" />
                                                        <input
                                                            type="date"
                                                            value={returnDate}
                                                            onChange={(e) => setReturnDate(e.target.value)}
                                                            min={date}
                                                            required={tripType === 'roundtrip'}
                                                            className="w-full pl-12 pr-4 py-4 bg-dark-700/50 border border-dark-600 rounded-2xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                                                            style={{ colorScheme: 'dark' }}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        {/* Options Row */}
                                        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-dark-700/50">
                                            <div className="flex-1 flex gap-3">
                                                {/* Travelers Selector */}
                                                <div className="flex-1 relative" ref={travelerRef}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowTravelers(!showTravelers)}
                                                        className="w-full flex items-center justify-between px-4 py-3 bg-dark-700/30 border border-dark-600/50 rounded-xl text-white hover:bg-dark-700/50 transition-all"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Users className="w-5 h-5 text-primary-400" />
                                                            <span className="text-sm font-medium">
                                                                {adults + children} {t('hero.travelers')}
                                                            </span>
                                                        </div>
                                                        <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${showTravelers ? 'rotate-180' : ''}`} />
                                                    </button>

                                                    {showTravelers && (
                                                        <div className="absolute top-full left-0 mt-2 w-64 p-4 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl z-50 animate-slide-up">
                                                            <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-white font-medium">{t('hero.adults')}</p>
                                                                        <p className="text-xs text-dark-400">12+ years</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 flex items-center justify-center bg-dark-700 rounded-lg text-white hover:bg-primary-500 transition-colors">-</button>
                                                                        <span className="text-white w-4 text-center">{adults}</span>
                                                                        <button type="button" onClick={() => setAdults(adults + 1)} className="w-8 h-8 flex items-center justify-center bg-dark-700 rounded-lg text-white hover:bg-primary-500 transition-colors">+</button>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-white font-medium">{t('hero.children')}</p>
                                                                        <p className="text-xs text-dark-400">2-11 years</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 flex items-center justify-center bg-dark-700 rounded-lg text-white hover:bg-primary-500 transition-colors">-</button>
                                                                        <span className="text-white w-4 text-center">{children}</span>
                                                                        <button type="button" onClick={() => setChildren(children + 1)} className="w-8 h-8 flex items-center justify-center bg-dark-700 rounded-lg text-white hover:bg-primary-500 transition-colors">+</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Cabin Class Selector */}
                                                <div className="flex-1 relative" ref={classRef}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowClass(!showClass)}
                                                        className="w-full flex items-center justify-between px-4 py-3 bg-dark-700/30 border border-dark-600/50 rounded-xl text-white hover:bg-dark-700/50 transition-all"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Briefcase className="w-5 h-5 text-primary-400" />
                                                            <span className="text-sm font-medium capitalize">
                                                                {t(`hero.${cabinClass}`)}
                                                            </span>
                                                        </div>
                                                        <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${showClass ? 'rotate-180' : ''}`} />
                                                    </button>

                                                    {showClass && (
                                                        <div className="absolute top-full left-0 mt-2 w-full p-2 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl z-50 animate-slide-up">
                                                            {['economy', 'premium', 'business', 'first'].map((c) => (
                                                                <button
                                                                    key={c}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setCabinClass(c)
                                                                        setShowClass(false)
                                                                    }}
                                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${cabinClass === c ? 'bg-primary-500 text-white' : 'text-dark-300 hover:bg-dark-700'}`}
                                                                >
                                                                    {t(`hero.${c}`)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="group relative btn-accent flex items-center justify-center gap-3 px-8 sm:px-12 py-4 shadow-glow-accent hover:shadow-accent-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600 animate-gradient"></div>
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white"></div>
                                                <Search className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
                                                <span className="relative z-10 whitespace-nowrap font-bold text-lg">
                                                    {t('hero.searchButton') || 'Trouver des économies'}
                                                </span>
                                                <span className="relative z-10 ml-2 text-2xl group-hover:translate-x-1 transition-transform">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Search History */}
                            {history.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Clock className="w-4 h-4 text-dark-400" />
                                        <p className="text-sm text-dark-400">{t('hero.recentSearches') || 'Recent searches'}:</p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {history.slice(0, 3).map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setFrom(search.from)
                                                    setTo(search.to)
                                                    setDate(search.date)
                                                }}
                                                className="group px-4 py-2 bg-dark-800/50 border border-dark-700 rounded-full text-sm text-dark-300 hover:border-primary-500/50 hover:text-white transition-all flex items-center gap-2"
                                            >
                                                <span className="font-mono text-primary-400">{search.from}</span>
                                                <ArrowRight className="w-3 h-3" />
                                                <span className="font-mono text-primary-400">{search.to}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Searches */}
                            <div className="flex flex-wrap justify-center gap-3">
                                {quickSearches.map((search) => (
                                    <button
                                        key={`${search.from}-${search.to}`}
                                        onClick={() => {
                                            const parts = date.split('-')
                                            const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : ''
                                            navigate(`/results?from=${search.from}&to=${search.to}&date=${formattedDate}`)
                                        }}
                                        className="px-4 py-2 bg-dark-800/30 border border-dark-700/50 rounded-full text-sm text-dark-300 
                             hover:border-primary-500/50 hover:text-primary-400 transition-all duration-300"
                                    >
                                        {search.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-dark-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                                {t('home.whyChoose')}
                            </h2>
                            <p className="text-dark-400 max-w-2xl mx-auto">
                                {t('home.whyChooseText')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`card-hover p-8 text-center group animate-slide-up opacity-0 [animation-fill-mode:forwards] animate-stagger-${index + 1}`}
                                >
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg mb-6 
                                group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="font-display text-xl font-semibold text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-dark-400">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: '40%', label: t('home.stats.avgSavings') },
                                { value: '50+', label: t('home.stats.hubAirports') },
                                { value: '1000+', label: t('home.stats.routesAnalyzed') },
                                { value: '4.8', label: t('home.stats.hubRating'), icon: Star },
                            ].map((stat, index) => (
                                <div key={index} className={`text-center animate-slide-up opacity-0 [animation-fill-mode:forwards] animate-stagger-${index + 1}`}>
                                    <div className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2 flex items-center justify-center gap-2">
                                        {stat.value}
                                        {stat.icon && <stat.icon className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse-subtle" />}
                                    </div>
                                    <p className="text-dark-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-gradient-to-br from-primary-900/50 to-dark-900">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                            {t('home.cta.title')}
                        </h2>
                        <p className="text-xl text-dark-300 mb-8">
                            {t('home.cta.subtitle')}
                        </p>
                        <button
                            onClick={() => navigate('/hubs')}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <span>{t('home.cta.button')}</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </section>
            </div>
        </>
    )
}
