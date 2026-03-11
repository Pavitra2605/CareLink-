/**
 * MapboxView.web.js — Web-platform replacement for MapboxView.js
 * Uses a DOM iframe instead of react-native-webview (which is native-only).
 * Metro/webpack automatically picks this file over MapboxView.js on web.
 */
import React, { useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

export default function MapboxView({
  userLat,
  userLng,
  highlightedId,
  style,
  onMarkerPress,
  onHospitalsFound,
}) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const buildHTML = useCallback(() => {
    if (!userLat || !userLng) return null;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #F5F4F0; }
    #map { width: 100%; height: 100%; }
    .user-dot {
      width: 18px; height: 18px; border-radius: 50%;
      background: #6B6BCC; border: 3px solid #fff;
      box-shadow: 0 0 0 0 rgba(107,107,204,0.5);
      animation: pulse 1.8s ease-out infinite;
    }
    @keyframes pulse {
      0%   { box-shadow: 0 0 0 0   rgba(107,107,204,0.55); }
      70%  { box-shadow: 0 0 0 14px rgba(107,107,204,0); }
      100% { box-shadow: 0 0 0 0   rgba(107,107,204,0); }
    }
    .hospital-pin {
      width: 38px; height: 38px; border-radius: 50%;
      border: 2.5px solid #fff; display: flex; align-items: center; justify-content: center;
      font-size: 18px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.28);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    .hospital-pin:hover { transform: scale(1.12); }
    .hospital-pin.highlighted { transform: scale(1.18); box-shadow: 0 0 0 4px rgba(107,107,204,0.45), 0 2px 10px rgba(0,0,0,0.28); }
    .pin-red { background: #D94F4F; } .pin-green { background: #2E9E6B; } .pin-blue { background: #3B7FCC; }
    .mapboxgl-popup-content { border-radius: 12px; padding: 12px 16px; font-family: -apple-system, sans-serif; max-width: 210px; box-shadow: 0 4px 20px rgba(0,0,0,0.18); }
    .p-name { font-weight: 700; font-size: 13.5px; color: #1A1A1A; margin-bottom: 5px; }
    .p-meta { font-size: 11.5px; color: #6B6B8A; display: flex; gap: 10px; margin-bottom: 6px; }
    .p-dir { margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 12px; color: #6B6BCC; font-weight: 600; cursor: pointer; text-align: center; }
    #loader { position: absolute; inset: 0; background: rgba(240,239,248,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: -apple-system, sans-serif; color: #6B6BCC; font-size: 13px; gap: 10px; z-index: 999; }
    .spinner { width: 28px; height: 28px; border: 3px solid rgba(107,107,204,0.25); border-top-color: #6B6BCC; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="loader"><div class="spinner"></div><span>Finding nearby hospitals…</span></div>
  <script>
    const TOKEN = '${MAPBOX_TOKEN}';
    const USER_LAT = ${userLat};
    const USER_LNG = ${userLng};
    function postMsg(data) { window.parent.postMessage(JSON.stringify(data), '*'); }
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({ container: 'map', style: 'mapbox://styles/mapbox/streets-v12', center: [USER_LNG, USER_LAT], zoom: 14, attributionControl: false });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
    const userEl = document.createElement('div'); userEl.className = 'user-dot';
    new mapboxgl.Marker({ element: userEl, anchor: 'center' }).setLngLat([USER_LNG, USER_LAT]).addTo(map);
    function haversine(lat1, lng1, lat2, lng2) {
      const R = 6371, toRad = d => d * Math.PI / 180;
      const dLat = toRad(lat2-lat1), dLng = toRad(lng2-lng1);
      const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
    function kmToTime(km) { const mins = Math.round((km/30)*60); return mins < 1 ? '1 min' : mins + ' min'; }
    const markerMap = {};
    function highlightMarker(id) { Object.entries(markerMap).forEach(([mid,{el}]) => el.classList.toggle('highlighted', mid === id)); }
    window.addEventListener('message', e => { try { const d = JSON.parse(e.data); if (d.type === 'highlight') highlightMarker(d.id); } catch(_){} });
    function pinClass(c) { c = (c||'').toLowerCase(); if (c.includes('pharmacy')||c.includes('clinic')) return 'pin-green'; if (c.includes('government')||c.includes('public')) return 'pin-blue'; return 'pin-red'; }
    async function fetchCategory(cat, lng, lat, limit) {
      try { const r = await fetch('https://api.mapbox.com/search/searchbox/v1/category/'+cat+'?proximity='+lng+','+lat+'&limit='+limit+'&language=en&access_token='+TOKEN); const d = await r.json(); return (d.features||[]).map(f=>({...f,_cat:cat})); } catch(e){ return []; }
    }
    async function init() {
      try {
        let features = await fetchCategory('hospital', USER_LNG, USER_LAT, 10);
        if (features.length < 3) features = features.concat(await fetchCategory('emergency', USER_LNG, USER_LAT, 10));
        if (features.length < 3) features = features.concat(await fetchCategory('clinic', USER_LNG, USER_LAT, 5));
        const seen = new Set(); features = features.filter(f => { const k = f.geometry.coordinates.join(','); if(seen.has(k)) return false; seen.add(k); return true; });
        const hospitals = [];
        features.forEach((f,i) => {
          const [lng, lat] = f.geometry.coordinates;
          const p = f.properties||{}; const name = p.name||p.text||(f.place_name||'').split(',')[0]||'Hospital';
          const category = (p.poi_category&&p.poi_category[0])||p._cat||'';
          const dist = haversine(USER_LAT, USER_LNG, lat, lng);
          const distStr = dist < 1 ? (dist*1000).toFixed(0)+' m' : dist.toFixed(1)+' km';
          const id = 'h'+i;
          const el = document.createElement('div'); el.className = 'hospital-pin '+pinClass(category); el.innerHTML = '🏥';
          const popup = new mapboxgl.Popup({ offset: 24, closeButton: false })
            .setHTML('<div class="p-name">'+name+'</div><div class="p-meta"><span>📍 '+distStr+'</span><span>🚗 '+kmToTime(dist)+'</span></div><div class="p-dir" onclick="window.parent.postMessage(JSON.stringify({type:\'directions\',lat:'+lat+',lng:'+lng+'}),\'*\')">Get Directions ↗</div>');
          popup.on('open', () => postMsg({ type: 'markerPress', id }));
          new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat([lng, lat]).setPopup(popup).addTo(map);
          markerMap[id] = { el };
          hospitals.push({ id, name, lat, lng, distance: distStr, time: kmToTime(dist), distKm: dist });
        });
        hospitals.sort((a,b) => a.distKm - b.distKm);
        postMsg({ type: 'hospitalsFound', hospitals });
        if (hospitals.length > 1) {
          const bounds = new mapboxgl.LngLatBounds(); bounds.extend([USER_LNG, USER_LAT]);
          hospitals.forEach(h => bounds.extend([h.lng, h.lat]));
          map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 1200 });
        }
      } catch(e) { postMsg({ type: 'error', message: e.message }); }
      finally { const l = document.getElementById('loader'); if(l) l.style.display='none'; }
    }
    map.on('load', init);
  </script>
</body>
</html>`;
  }, [userLat, userLng]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const html = buildHTML();
    if (!html) return;

    // Remove old iframe
    if (iframeRef.current) {
      container.removeChild(iframeRef.current);
      iframeRef.current = null;
    }

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.srcdoc = html;
    iframeRef.current = iframe;
    container.appendChild(iframe);

    const handleMessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'markerPress' && onMarkerPress) onMarkerPress(data.id);
        else if (data.type === 'hospitalsFound' && onHospitalsFound) onHospitalsFound(data.hospitals);
        else if (data.type === 'directions') {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}&travelmode=driving`, '_blank');
        }
      } catch (_) {}
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      if (iframeRef.current && container.contains(iframeRef.current)) {
        container.removeChild(iframeRef.current);
        iframeRef.current = null;
      }
    };
  }, [buildHTML, onMarkerPress, onHospitalsFound]);

  // Send highlight command to iframe
  useEffect(() => {
    if (iframeRef.current && highlightedId) {
      try {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ type: 'highlight', id: highlightedId }), '*'
        );
      } catch (_) {}
    }
  }, [highlightedId]);

  return (
    <View
      ref={containerRef}
      style={[styles.container, style]}
    />
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
});
