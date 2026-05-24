'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Lang } from '@/lib/i18n';
import type { ContactDealer } from '@/lib/types';

/**
 * Real interactive map of Uzbekistan using Leaflet + OpenStreetMap tiles.
 * Markers are placed at each dealer's regional capital. Clicking a marker
 * selects that region — the parent shows full dealer info beside the map.
 */

interface RegionDef {
  id: string;
  name: { uz: string; ru: string; en: string };
  /** [lat, lng] of the regional capital */
  coords: [number, number];
  match: RegExp;
}

const REGIONS: RegionDef[] = [
  { id: 'karakalpakstan', name: { uz: 'Qoraqalpogʻiston', ru: 'Каракалпакстан', en: 'Karakalpakstan' }, coords: [42.4607, 59.6107], match: /qoraqalpog|каракалп/i },
  { id: 'khorezm',        name: { uz: 'Xorazm', ru: 'Хорезм', en: 'Khorezm' },                          coords: [41.5500, 60.6333], match: /xorazm|хорезм/i },
  { id: 'navoiy',         name: { uz: 'Navoiy', ru: 'Навои', en: 'Navoiy' },                            coords: [40.0844, 65.3792], match: /navoiy|навои/i },
  { id: 'bukhara',        name: { uz: 'Buxoro', ru: 'Бухара', en: 'Bukhara' },                          coords: [39.7747, 64.4286], match: /buxoro|бухар/i },
  { id: 'samarkand',      name: { uz: 'Samarqand', ru: 'Самарканд', en: 'Samarkand' },                  coords: [39.6542, 66.9597], match: /samarqand|самарканд/i },
  { id: 'kashkadarya',    name: { uz: 'Qashqadaryo', ru: 'Кашкадарья', en: 'Kashkadarya' },             coords: [38.8606, 65.7889], match: /qashqadar|кашкадар/i },
  { id: 'surkhandarya',   name: { uz: 'Surxondaryo', ru: 'Сурхандарья', en: 'Surkhandarya' },           coords: [37.2242, 67.2783], match: /surxon|сурхан/i },
  { id: 'jizzakh',        name: { uz: 'Jizzax', ru: 'Джизак', en: 'Jizzakh' },                          coords: [40.1158, 67.8422], match: /jizzax|джизак/i },
  { id: 'sirdaryo',       name: { uz: 'Sirdaryo', ru: 'Сырдарья', en: 'Sirdaryo' },                     coords: [40.4894, 68.7842], match: /sirdaryo|сырдарь/i },
  { id: 'tashkent_region',name: { uz: 'Toshkent vil.', ru: 'Ташкент обл.', en: 'Tashkent region' },     coords: [41.0500, 69.5000], match: /toshkent vil|ташкент.+обл/i },
  { id: 'tashkent_city',  name: { uz: 'Toshkent', ru: 'Ташкент', en: 'Tashkent' },                      coords: [41.2995, 69.2401], match: /toshkent sh|г\.\s*ташкент|tashkent city/i },
  { id: 'namangan',       name: { uz: 'Namangan', ru: 'Наманган', en: 'Namangan' },                     coords: [40.9983, 71.6726], match: /namangan|наманган/i },
  { id: 'andijan',        name: { uz: 'Andijon', ru: 'Андижан', en: 'Andijan' },                        coords: [40.7821, 72.3442], match: /andijon|андижан/i },
  { id: 'fergana',        name: { uz: 'Fargʻona', ru: 'Фергана', en: 'Fergana' },                       coords: [40.3864, 71.7864], match: /far.*ona|ферган/i },
];

interface UzbekistanMapProps {
  dealers: ContactDealer[];
  lang: Lang;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function UzbekistanMap({ dealers, lang, selectedId, onSelect }: UzbekistanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  // Map dealer.region (string or { ru, uz } bundle) to region id
  const dealerByRegion = new Map<string, ContactDealer[]>();
  for (const d of dealers) {
    const text = typeof d.region === 'string'
      ? d.region
      : (d.region as any)?.uz || (d.region as any)?.ru || '';
    const r = REGIONS.find((reg) => reg.match.test(text));
    if (r) {
      const arr = dealerByRegion.get(r.id) || [];
      arr.push(d);
      dealerByRegion.set(r.id, arr);
    }
  }

  // Initialize Leaflet map (once)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;
    (async () => {
      // Dynamic import — Leaflet uses window, can't SSR
      const L = (await import('leaflet')).default;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [41.3, 64.5],
        zoom: 6,
        minZoom: 5,
        maxZoom: 12,
        scrollWheelZoom: false, // avoid hijacking page scroll
        zoomControl: true,
        attributionControl: true,
      });

      // CartoDB Positron — clean, modern light tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
      }).addTo(map);

      // Fit Uzbekistan bounds
      map.fitBounds([
        [37.0, 56.0],
        [45.6, 73.2],
      ], { padding: [20, 20] });

      mapRef.current = map;

      // Add markers
      buildMarkers(L);

      // Re-enable scroll-wheel zoom on focus / click
      map.on('focus', () => map.scrollWheelZoom.enable());
      map.on('blur',  () => map.scrollWheelZoom.disable());
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build / rebuild markers when dealers or lang changes
  useEffect(() => {
    (async () => {
      if (!mapRef.current) return;
      const L = (await import('leaflet')).default;
      buildMarkers(L);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealers, lang]);

  // Update marker styles when selection changes
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement() as HTMLElement | null;
      if (!el) return;
      const inner = el.querySelector('[data-marker-inner]') as HTMLElement | null;
      if (!inner) return;
      if (id === selectedId) {
        inner.classList.add('marker-active');
      } else {
        inner.classList.remove('marker-active');
      }
    });
  }, [selectedId]);

  async function buildMarkers(L: any) {
    if (!mapRef.current) return;

    // Clear existing
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    for (const region of REGIONS) {
      const hasDealer = dealerByRegion.has(region.id);
      if (!hasDealer) continue;

      const name = region.name[lang] || region.name.uz;
      const isSelected = selectedId === region.id;
      const isCity = region.id === 'tashkent_city';

      const icon = L.divIcon({
        className: 'uz-marker',
        html: `
          <div data-marker-inner class="uz-marker-inner ${isSelected ? 'marker-active' : ''}">
            <div class="uz-marker-pulse"></div>
            <div class="uz-marker-pin"></div>
            <div class="uz-marker-label">${name}</div>
          </div>
        `,
        iconSize: [120, 44],
        iconAnchor: [60, 38],
      });

      const marker = L.marker(region.coords, { icon, riseOnHover: true }).addTo(mapRef.current);
      marker.on('click', () => {
        onSelect(selectedId === region.id ? null : region.id);
      });

      markersRef.current.set(region.id, marker);

      // Tiny dot for Tashkent city to distinguish it
      if (isCity) {
        L.circleMarker(region.coords, {
          radius: 4,
          color: '#047857',
          fillColor: '#10b981',
          fillOpacity: 1,
          weight: 2,
        }).addTo(mapRef.current);
      }
    }
  }

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-ink-100"
        style={{ minHeight: 360 }}
      />

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-500">
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-full bg-brand-500 ring-2 ring-white" />
          Diler joylashgan shahar
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="text-brand-700 font-medium">{dealers.length}</span>
          <span>viloyatda diler mavjud</span>
        </span>
      </div>
    </div>
  );
}

export { REGIONS };
export type { RegionDef };
