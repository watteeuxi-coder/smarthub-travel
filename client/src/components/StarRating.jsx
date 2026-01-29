import { Star } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

/**
 * Calculate star rating based on savings percentage
 * @param {number} savingsPercent - Percentage of savings
 * @returns {number} Star rating (0-5)
 */
export function calculateStarRating(savingsPercent) {
    if (savingsPercent >= 40) return 5
    if (savingsPercent >= 30) return 4
    if (savingsPercent >= 20) return 3
    if (savingsPercent >= 10) return 2
    if (savingsPercent > 0) return 1
    return 0 // Negative or zero savings
}

/**
 * StarRating - Displays dynamic star rating based on savings percentage
 * @param {Object} props
 * @param {number} props.savingsPercent - The savings percentage to calculate rating from
 * @param {boolean} props.showValue - Whether to show the numeric rating value
 * @param {string} props.size - Size of stars: 'sm', 'md', 'lg'
 */
export default function StarRating({
    savingsPercent = 0,
    showValue = true,
    size = 'md'
}) {
    const { t } = useLanguage()
    const rating = calculateStarRating(savingsPercent)

    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    }

    const starSize = sizeClasses[size] || sizeClasses.md

    // Handle 0 stars case
    if (rating === 0) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`${starSize} text-dark-600`}
                        />
                    ))}
                </div>
                <span className="text-dark-400 text-sm italic">
                    {t('rating.noSavings') || 'No savings'}
                </span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`${starSize} ${i < rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-dark-600'
                            }`}
                    />
                ))}
            </div>
            {showValue && (
                <span className="text-white font-semibold">{rating}</span>
            )}
        </div>
    )
}
