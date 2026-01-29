import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLanguage = languages.find(lang => lang.code === i18n.resolvedLanguage) || languages[0];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-800/50 border border-dark-600 
                       hover:border-primary-500/50 hover:bg-dark-700/50 transition-all duration-300"
            >
                <Globe className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-dark-200 hidden sm:inline-block">
                    {currentLanguage.name}
                </span>
                <span className="sm:hidden text-lg">
                    {currentLanguage.flag}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-dark-800 border border-dark-600 shadow-xl shadow-black/50 overflow-hidden z-50">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-dark-700 transition-colors
                                          ${i18n.resolvedLanguage === lang.code ? 'text-primary-400 bg-dark-700/50' : 'text-dark-200'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </span>
                                {i18n.resolvedLanguage === lang.code && (
                                    <Check className="w-4 h-4" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
