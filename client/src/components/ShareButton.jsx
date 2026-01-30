import { Share2, Check } from 'lucide-react'
import { useState } from 'react'
import { useToast } from './Toast'

export default function ShareButton({ title, text, url }) {
    const [copied, setCopied] = useState(false)
    const { addToast } = useToast()

    const handleShare = async () => {
        const shareData = {
            title: title || 'SmartHub Travel',
            text: text || 'Check out these flight savings!',
            url: url || window.location.href
        }

        // Try Web Share API first (mobile)
        if (navigator.share) {
            try {
                await navigator.share(shareData)
                addToast('Shared successfully!', 'success')
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err)
                }
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url)
                setCopied(true)
                addToast('Link copied to clipboard!', 'success')
                setTimeout(() => setCopied(false), 2000)
            } catch (err) {
                addToast('Failed to copy link', 'error')
                console.error('Copy failed:', err)
            }
        }
    }

    return (
        <button
            onClick={handleShare}
            className="btn-outline flex items-center gap-2 px-4 py-2"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                </>
            )}
        </button>
    )
}
