import { Link, useLocation } from 'react-router-dom'
import { Plane } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
    const location = useLocation()
    const { t } = useLanguage()

    const isActive = (path) => location.pathname === path

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                            <Plane className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-xl text-white">
                            Smart<span className="text-primary-400">Hub</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={isActive('/') ? 'nav-link-active' : 'nav-link'}
                        >
                            {t('nav.home')}
                        </Link>
                        <Link
                            to="/hubs"
                            className={isActive('/hubs') ? 'nav-link-active' : 'nav-link'}
                        >
                            {t('nav.hubs')}
                        </Link>
                        <Link
                            to="/about"
                            className={isActive('/about') ? 'nav-link-active' : 'nav-link'}
                        >
                            {t('nav.about')}
                        </Link>
                    </div>

                    {/* Language Switcher */}
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    )
}
