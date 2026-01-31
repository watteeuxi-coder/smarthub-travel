import { Link } from 'react-router-dom'
import { Plane, Twitter, Facebook, Instagram, Linkedin, Mail, MapPin } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
    const { t } = useLanguage()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-dark-900 border-t border-dark-700/50 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4 group">
                            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl group-hover:scale-110 transition-transform">
                                <Plane className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-display font-bold text-xl text-white">
                                Smart<span className="text-primary-400">Hub</span>
                            </span>
                        </Link>
                        <p className="text-dark-400 text-sm mb-4 leading-relaxed">
                            {t('footer.desc') || 'Économisez jusqu\'à 50% sur vos vols long-courriers en transitant par les meilleurs hubs internationaux.'}
                        </p>
                        <div className="flex items-center gap-2 text-dark-500 text-sm mb-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>Paris, France</span>
                        </div>
                        <div className="flex items-center gap-2 text-dark-500 text-sm">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <a
                                href="mailto:contact@smarthub.travel"
                                className="hover:text-primary-400 transition-colors"
                            >
                                contact@smarthub.travel
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">
                            {t('footer.quickLinks') || 'Liens rapides'}
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                                    {t('nav.home') || 'Accueil'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/hubs" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                                    {t('nav.hubs') || 'Nos hubs'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                                    {t('nav.about') || 'À propos'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/how-it-works" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                                    {t('footer.howItWorks') || 'Comment ça marche'}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Support */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">
                            {t('footer.legal') || 'Légal'}
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/terms" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                                    {t('footer.terms') || 'Conditions d\'utilisation'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                                    {t('footer.privacy') || 'Politique de confidentialité'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                                    {t('footer.cookies') || 'Cookies'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                                    {t('footer.contact') || 'Contact'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                                    {t('footer.faq') || 'FAQ'}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-display font-semibold text-white mb-4">
                            {t('footer.connect') || 'Suivez-nous'}
                        </h3>
                        <div className="flex flex-wrap gap-3 mb-6">
                            <a
                                href="https://twitter.com/smarthubtravel"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                                className="p-2.5 bg-dark-800 rounded-lg hover:bg-primary-500 text-dark-400 hover:text-white transition-all"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://facebook.com/smarthubtravel"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="p-2.5 bg-dark-800 rounded-lg hover:bg-primary-500 text-dark-400 hover:text-white transition-all"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com/smarthubtravel"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="p-2.5 bg-dark-800 rounded-lg hover:bg-primary-500 text-dark-400 hover:text-white transition-all"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com/company/smarthubtravel"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="p-2.5 bg-dark-800 rounded-lg hover:bg-primary-500 text-dark-400 hover:text-white transition-all"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                        <p className="text-dark-400 text-sm">
                            {t('footer.social') || 'Restez informé des meilleures offres et astuces voyage.'}
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-dark-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-dark-500 text-sm text-center md:text-left">
                        © {currentYear} SmartHub Travel. {t('footer.rights') || 'Tous droits réservés.'}
                    </p>
                    <p className="text-dark-500 text-sm">
                        {t('footer.madeWith') || 'Fait avec ❤️ pour les voyageurs malins'}
                    </p>
                </div>
            </div>
        </footer>
    )
}
