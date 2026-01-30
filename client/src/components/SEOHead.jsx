import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../context/LanguageContext'

export default function SEOHead({
    title,
    description,
    keywords,
    image = 'https://smarthub-travel.vercel.app/og-image.jpg',
    url = window.location.href
}) {
    const { t, language } = useLanguage()

    const defaultTitle = t('seo.defaultTitle') || 'SmartHub Travel - Find Cheaper Flights Through International Hubs'
    const defaultDescription = t('seo.defaultDescription') || 'Save up to 40% on international flights by discovering optimal routes through major airline hubs. Compare prices and find the best connections.'

    const finalTitle = title ? `${title} | SmartHub Travel` : defaultTitle
    const finalDescription = description || defaultDescription

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{finalTitle}</title>
            <meta name="title" content={finalTitle} />
            <meta name="description" content={finalDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="language" content={language} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={image} />
            <meta property="og:locale" content={language === 'fr' ? 'fr_FR' : 'en_US'} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDescription} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    )
}
