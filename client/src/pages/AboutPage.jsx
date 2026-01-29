import { Link } from 'react-router-dom'
import { Search, ArrowLeftRight, PiggyBank, Plane, Heart, Globe, Target } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function AboutPage() {
    const { t } = useLanguage()

    const steps = [
        {
            icon: Search,
            title: t('about.step1Title'),
            description: t('about.step1Text'),
            color: 'from-primary-500 to-primary-400',
        },
        {
            icon: ArrowLeftRight,
            title: t('about.step2Title'),
            description: t('about.step2Text'),
            color: 'from-accent-500 to-accent-400',
        },
        {
            icon: PiggyBank,
            title: t('about.step3Title'),
            description: t('about.step3Text'),
            color: 'from-amber-500 to-amber-400',
        },
    ]

    const values = [
        {
            icon: Heart,
            title: t('about.values.passionTitle'),
            description: t('about.values.passionDesc'),
        },
        {
            icon: Globe,
            title: t('about.values.globalTitle'),
            description: t('about.values.globalDesc'),
        },
        {
            icon: Target,
            title: t('about.values.focusTitle'),
            description: t('about.values.focusDesc'),
        },
    ]

    return (
        <div className="min-h-screen py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
                        <Plane className="w-4 h-4 text-primary-400" />
                        <span className="text-sm font-medium text-primary-300">Our Story</span>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                        {t('about.title')}
                    </h1>
                    <p className="text-xl text-dark-300 max-w-2xl mx-auto">
                        {t('about.missionText')}
                    </p>
                </div>

                {/* How It Works */}
                <section className="mb-20">
                    <h2 className="font-display text-3xl font-bold text-white text-center mb-12">
                        {t('about.howItWorks')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-dark-600 to-dark-700" />
                                )}

                                <div className="card-hover p-8 text-center relative z-10">
                                    {/* Step Number */}
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-dark-800 border-2 border-primary-500 rounded-full flex items-center justify-center text-primary-400 font-bold text-sm">
                                        {index + 1}
                                    </div>

                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg mb-6 mt-4`}>
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="font-display text-xl font-semibold text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-dark-400">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mission */}
                <section className="mb-20">
                    <div className="card p-8 md:p-12 bg-gradient-to-br from-primary-900/30 to-dark-800/50 border-primary-500/20">
                        <h2 className="font-display text-3xl font-bold text-white mb-6">
                            {t('about.mission')}
                        </h2>
                        <p className="text-xl text-dark-300 leading-relaxed">
                            {t('about.missionDesc1')}
                        </p>
                        <p className="text-xl text-dark-300 leading-relaxed mt-4">
                            {t('about.missionDesc2')}
                        </p>
                    </div>
                </section>

                {/* Values */}
                <section className="mb-20">
                    <h2 className="font-display text-3xl font-bold text-white text-center mb-12">
                        {t('about.valuesTitle')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <div key={index} className="card-hover p-8 text-center">
                                <div className="inline-flex p-4 bg-dark-700/50 rounded-2xl mb-6">
                                    <value.icon className="w-8 h-8 text-primary-400" />
                                </div>
                                <h3 className="font-display text-xl font-semibold text-white mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-dark-400">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center">
                    <h2 className="font-display text-3xl font-bold text-white mb-6">
                        {t('about.ctaTitle')}
                    </h2>
                    <p className="text-dark-400 mb-8 max-w-lg mx-auto">
                        {t('about.ctaText')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/" className="btn-primary">
                            {t('about.searchFlights')}
                        </Link>
                        <Link to="/hubs" className="btn-outline">
                            {t('about.exploreHubs')}
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}
