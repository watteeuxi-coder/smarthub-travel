import { Link } from 'react-router-dom'
import { Plane, Github, Twitter, Mail } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
    const { t } = useLanguage()

    return (
        <footer className="bg-dark-900/50 border-t border-dark-700/50 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                                <Plane className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-display font-bold text-xl text-white">
                                Smart<span className="text-primary-400">Hub</span>
                            </span>
                        </Link>
                        <p className="text-dark-400 max-w-md">
                            {t('footer.desc')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-dark-400 hover:text-primary-400 transition-colors">
                                    {t('nav.home')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/hubs" className="text-dark-400 hover:text-primary-400 transition-colors">
                                    {t('nav.hubs')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-dark-400 hover:text-primary-400 transition-colors">
                                    {t('nav.about')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">{t('footer.connect')}</h3>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="p-2 bg-dark-800 rounded-lg hover:bg-primary-500/20 hover:text-primary-400 transition-all"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 bg-dark-800 rounded-lg hover:bg-primary-500/20 hover:text-primary-400 transition-all"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 bg-dark-800 rounded-lg hover:bg-primary-500/20 hover:text-primary-400 transition-all"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-dark-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-dark-500 text-sm">
                        {t('footer.rights')}
                    </p>
                    <p className="text-dark-500 text-sm">
                        {t('footer.madeWith')}
                    </p>
                </div>
            </div>
        </footer>
    )
}
