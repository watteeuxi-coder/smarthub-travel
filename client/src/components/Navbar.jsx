import { Link, useLocation } from 'react-router-dom'
import { Plane, Menu, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { useState } from 'react'

export default function Navbar() {
    const location = useLocation()
    const { t } = useLanguage()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-white hover:bg-dark-800 rounded-lg transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Desktop Language Switcher */}
                    <div className="hidden md:block">
                        <LanguageSwitcher />
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-dark-700/50">
                        <div className="flex flex-col space-y-3">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-2 rounded-lg transition-colors ${isActive('/') ? 'bg-primary-500/20 text-primary-400 font-semibold' : 'text-dark-300 hover:text-white hover:bg-dark-800'}`}
                            >
                                {t('nav.home')}
                            </Link>
                            <Link
                                to="/hubs"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-2 rounded-lg transition-colors ${isActive('/hubs') ? 'bg-primary-500/20 text-primary-400 font-semibold' : 'text-dark-300 hover:text-white hover:bg-dark-800'}`}
                            >
                                {t('nav.hubs')}
                            </Link>
                            <Link
                                to="/about"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-2 rounded-lg transition-colors ${isActive('/about') ? 'bg-primary-500/20 text-primary-400 font-semibold' : 'text-dark-300 hover:text-white hover:bg-dark-800'}`}
                            >
                                {t('nav.about')}
                            </Link>
                            <div className="px-4 pt-2">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                    </div>
                )}
        </div>
        </nav >
    )
}
