import { createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const { t, i18n } = useTranslation()

    const language = i18n.language

    // Map legacy toggleLanguage to something that makes sense or warn, 
    // but better to expose a setLanguage function.
    // However, existing Navbar uses toggleLanguage. 
    // We will update Navbar to use changeLanguage, but for compatibility let's keep it working.
    // Actually, I'll provide setLanguage which calls i18n.changeLanguage

    const setLanguage = (lang) => {
        i18n.changeLanguage(lang)
    }

    const toggleLanguage = () => {
        const nextLang = language === 'en' ? 'fr' : 'en'
        i18n.changeLanguage(nextLang)
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
