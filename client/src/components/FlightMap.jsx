import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { useLanguage } from '../context/LanguageContext'

export default function FlightMap({ origin, destination, hubRoutes = [] }) {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const { t } = useLanguage()

    useEffect(() => {
        if (!mapRef.current || !origin || !destination) return

        // Clean up existing map
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove()
        }

        // Initialize map
        const map = L.map(mapRef.current, {
            center: [30, 50],
            zoom: 2,
            minZoom: 2,
            maxZoom: 8,
            zoomControl: true,
            attributionControl: true,
        })

        // Add dark tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20,
        }).addTo(map)

        // Custom marker icons
        const createIcon = (color, size = 12) => {
            return L.divIcon({
                className: 'custom-marker',
                html: `<div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        "></div>`,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
            })
        }

        // Origin marker (blue)
        const originCoords = [origin.coords[1], origin.coords[0]]
        L.marker(originCoords, { icon: createIcon('#3b82f6', 16) })
            .addTo(map)
            .bindPopup(`
        <div style="text-align: center;">
          <strong style="font-size: 14px;">${origin.name}</strong>
          <div style="color: #94a3b8; font-size: 12px;">${origin.city}, ${origin.country}</div>
          <div style="margin-top: 4px; font-size: 11px; color: #3b82f6;">${t('map.origin')}</div>
        </div>
      `)

        // Destination marker (amber)
        const destCoords = [destination.coords[1], destination.coords[0]]
        L.marker(destCoords, { icon: createIcon('#f59e0b', 16) })
            .addTo(map)
            .bindPopup(`
        <div style="text-align: center;">
          <strong style="font-size: 14px;">${destination.name}</strong>
          <div style="color: #94a3b8; font-size: 12px;">${destination.city}, ${destination.country}</div>
          <div style="margin-top: 4px; font-size: 11px; color: #f59e0b;">${t('map.destination')}</div>
        </div>
      `)

        // Direct route line (gray, dashed)
        L.polyline([originCoords, destCoords], {
            color: '#475569',
            weight: 2,
            dashArray: '5, 10',
            opacity: 0.5,
        }).addTo(map)

        // Hub routes
        hubRoutes.forEach((route, index) => {
            if (!route.hubInfo?.coords) return

            const hubCoords = [route.hubInfo.coords[1], route.hubInfo.coords[0]]
            const isFirst = index === 0

            // Hub marker (green for recommended, purple for others)
            const hubColor = isFirst ? '#10b981' : '#8b5cf6'
            L.marker(hubCoords, { icon: createIcon(hubColor, isFirst ? 14 : 10) })
                .addTo(map)
                .bindPopup(`
          <div style="text-align: center;">
            <strong style="font-size: 14px;">${route.hubInfo.name}</strong>
            <div style="color: #94a3b8; font-size: 12px;">${route.hubInfo.city}</div>
            <div style="margin-top: 8px; padding: 4px 8px; background: rgba(16, 185, 129, 0.2); border-radius: 4px;">
              <span style="color: #10b981; font-weight: bold;">${t('results.save')} $${route.savings}</span>
            </div>
            ${isFirst ? `<div style="margin-top: 4px; font-size: 11px; color: #10b981;">⭐ ${t('results.recommended')}</div>` : ''}
          </div>
        `)

            // Hub route lines
            const lineColor = isFirst ? '#10b981' : '#8b5cf6'
            const lineOpacity = isFirst ? 0.8 : 0.4
            const lineWeight = isFirst ? 3 : 2

            // Origin to Hub
            L.polyline([originCoords, hubCoords], {
                color: lineColor,
                weight: lineWeight,
                opacity: lineOpacity,
            }).addTo(map)

            // Hub to Destination
            L.polyline([hubCoords, destCoords], {
                color: lineColor,
                weight: lineWeight,
                opacity: lineOpacity,
            }).addTo(map)
        })

        // Fit map to show all points
        const allCoords = [
            originCoords,
            destCoords,
            ...hubRoutes
                .filter(r => r.hubInfo?.coords)
                .map(r => [r.hubInfo.coords[1], r.hubInfo.coords[0]])
        ]

        if (allCoords.length > 0) {
            const bounds = L.latLngBounds(allCoords)
            map.fitBounds(bounds, { padding: [30, 30] })
        }

        mapInstanceRef.current = map

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [origin, destination, hubRoutes, t])

    return (
        <div className="relative">
            <div
                ref={mapRef}
                className="w-full h-80 rounded-xl overflow-hidden"
                style={{ background: '#0f172a' }}
            />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-dark-800/90 backdrop-blur-sm rounded-lg p-3 border border-dark-700/50">
                <div className="flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                        <span className="text-dark-300">{t('map.origin')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-dark-300">{t('map.destination')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent-500" />
                        <span className="text-dark-300">{t('map.bestHub')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 border-t-2 border-dashed border-dark-500" />
                        <span className="text-dark-300">{t('map.direct')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
