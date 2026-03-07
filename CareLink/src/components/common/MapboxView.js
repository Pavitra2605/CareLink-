import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

/**
 * MapboxView — centers on the user's real GPS location, queries Mapbox
 * Geocoding API for nearby hospitals, places markers, and posts the
 * hospital list back to React Native.
 *
 * Props:
 *   userLat          – latitude from expo-location (required)
 *   userLng          – longitude from expo-location (required)
 *   highlightedId    – hospital id to highlight (from list selection)
 *   style            – extra style for the outer container
 *   onMarkerPress    – callback({ id, name, lat, lng, distance, time })
 *   onHospitalsFound – callback(hospitals[]) with real POI data
 */
export default function MapboxView({
  userLat,
  userLng,
  highlightedId,
  style,
  onMarkerPress,
  onHospitalsFound,
}) {
  const webviewRef = useRef(null);

  // Send highlight command to WebView when highlightedId changes
  React.useEffect(() => {
    if (webviewRef.current && highlightedId) {
      webviewRef.current.injectJavaScript(
        `highlightMarker(${JSON.stringify(highlightedId)}); true;`
      );
    }
  }, [highlightedId]);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #f0eff8; }
    #map { width: 100%; height: 100%; }

    /* ── You-are-here pulse ── */
    .user-dot {
      width: 18px; height: 18px;
      border-radius: 50%;
      background: #6B6BCC;
      border: 3px solid #fff;
      box-shadow: 0 0 0 0 rgba(107,107,204,0.5);
      animation: pulse 1.8s ease-out infinite;
    }
    @keyframes pulse {
      0%   { box-shadow: 0 0 0 0   rgba(107,107,204,0.55); }
      70%  { box-shadow: 0 0 0 14px rgba(107,107,204,0);   }
      100% { box-shadow: 0 0 0 0   rgba(107,107,204,0);    }
    }

    /* ── Hospital pin ── */
    .hospital-pin {
      width: 38px; height: 38px;
      border-radius: 50%;
      border: 2.5px solid #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.28);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    .hospital-pin:hover { transform: scale(1.12); }
    .hospital-pin.highlighted {
      transform: scale(1.18);
      box-shadow: 0 0 0 4px rgba(107,107,204,0.45), 0 2px 10px rgba(0,0,0,0.28);
    }
    .pin-red    { background: #D94F4F; }
    .pin-green  { background: #2E9E6B; }
    .pin-blue   { background: #3B7FCC; }

    /* ── Popup ── */
    .mapboxgl-popup-content {
      border-radius: 12px;
      padding: 12px 16px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 210px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.18);
    }
    .mapboxgl-popup-tip { border-top-color: #fff !important; }
    .p-name  { font-weight: 700; font-size: 13.5px; color: #1A1A1A; margin-bottom: 5px; }
    .p-meta  { font-size: 11.5px; color: #6B6B8A; display: flex; gap: 10px; margin-bottom: 6px; }
    .p-badge {
      display: inline-block; background: #FDECEA; color: #D94F4F;
      font-size: 10px; font-weight: 700; border-radius: 4px; padding: 2px 6px;
    }
    .p-dir {
      margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;
      font-size: 12px; color: #6B6BCC; font-weight: 600;
      cursor: pointer; text-align: center;
    }

    /* ── Loading overlay ── */
    #loader {
      position: absolute; inset: 0;
      background: rgba(240,239,248,0.85);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      font-family: -apple-system, sans-serif;
      color: #6B6BCC; font-size: 13px; gap: 10px;
      z-index: 999;
    }
    .spinner {
      width: 28px; height: 28px;
      border: 3px solid rgba(107,107,204,0.25);
      border-top-color: #6B6BCC;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="loader"><div class="spinner"></div><span>Finding nearby hospitals…</span></div>
  <script>
    const TOKEN   = '${MAPBOX_TOKEN}';
    const USER_LAT = ${userLat};
    const USER_LNG = ${userLng};

    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [USER_LNG, USER_LAT],
      zoom: 14,
      attributionControl: false,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');

    // ── You-are-here marker ──────────────────────────────────────────
    const userEl = document.createElement('div');
    userEl.className = 'user-dot';
    new mapboxgl.Marker({ element: userEl, anchor: 'center' })
      .setLngLat([USER_LNG, USER_LAT])
      .addTo(map);

    // ── Haversine distance (km) ──────────────────────────────────────
    function haversine(lat1, lng1, lat2, lng2) {
      const R = 6371, toRad = d => d * Math.PI / 180;
      const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
      const a = Math.sin(dLat/2)**2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function kmToTime(km) {
      const mins = Math.round((km / 30) * 60);
      return mins < 1 ? '1 min' : mins + ' min';
    }

    // ── Active markers map ───────────────────────────────────────────
    const markerMap = {}; // id -> { marker, el }

    function highlightMarker(id) {
      Object.entries(markerMap).forEach(([mid, { el }]) => {
        el.classList.toggle('highlighted', mid === id);
      });
    }
    window.highlightMarker = highlightMarker;

    function pinClass(category) {
      if (!category) return 'pin-red';
      const c = category.toLowerCase();
      if (c.includes('pharmacy') || c.includes('clinic') || c.includes('doctor')) return 'pin-green';
      if (c.includes('government') || c.includes('public')) return 'pin-blue';
      return 'pin-red';
    }

    // ── Search Box Category API (finds real nearby hospital POIs) ──────
    // Categories tried in order; results are merged & deduplicated.
    const CATEGORIES = ['hospital', 'emergency', 'clinic', 'medical_clinic'];

    async function fetchCategory(category, lng, lat, limit) {
      const url =
        'https://api.mapbox.com/search/searchbox/v1/category/' + category +
        '?proximity=' + lng + ',' + lat +
        '&limit=' + limit +
        '&language=en' +
        '&access_token=' + TOKEN;
      try {
        const res = await fetch(url);
        const data = await res.json();
        return (data.features || []).map(f => ({ ...f, _cat: category }));
      } catch(e) { return []; }
    }

    async function searchHospitals(lng, lat, limit) {
      limit = limit || 10;
      // Search 'hospital' first; if short, add 'emergency' results too
      let features = await fetchCategory('hospital', lng, lat, limit);

      if (features.length < 3) {
        const extra = await fetchCategory('emergency', lng, lat, limit);
        features = features.concat(extra);
      }
      if (features.length < 3) {
        const extra2 = await fetchCategory('clinic', lng, lat, 5);
        features = features.concat(extra2);
      }

      // Deduplicate by coordinate pair
      const seen = new Set();
      return features.filter(f => {
        const key = f.geometry.coordinates.join(',');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    function clearMarkers() {
      Object.values(markerMap).forEach(({ marker }) => marker.remove());
      Object.keys(markerMap).forEach(k => delete markerMap[k]);
    }

    function placeMarkers(features) {
      clearMarkers();
      const hospitals = [];

      features.forEach((f, i) => {
        const [lng, lat] = f.geometry.coordinates;
        // Search Box API uses properties.name; fallback to place_name for v5
        const p = f.properties || {};
        const name = p.name || p.text || (f.place_name || '').split(',')[0] || 'Hospital';
        const category = (p.poi_category && p.poi_category[0]) || p._cat || '';
        const dist = haversine(USER_LAT, USER_LNG, lat, lng);
        const distStr = dist < 1
          ? (dist * 1000).toFixed(0) + ' m'
          : dist.toFixed(1) + ' km';
        const id = 'h' + i;

        const el = document.createElement('div');
        el.className = 'hospital-pin ' + pinClass(category);
        el.innerHTML = '🏥';

        const popup = new mapboxgl.Popup({ offset: 24, closeButton: false })
          .setHTML(
            '<div class="p-name">' + name + '</div>' +
            '<div class="p-meta">' +
              '<span>📍 ' + distStr + '</span>' +
              '<span>🚗 ' + kmToTime(dist) + '</span>' +
            '</div>' +
            '<div class="p-dir" onclick="openDir(' + lat + ',' + lng + ')">Get Directions ↗</div>'
          );

        popup.on('open', () => {
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'markerPress', id })
          );
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        markerMap[id] = { marker, el };

        hospitals.push({
          id,
          name,
          lat,
          lng,
          distance: distStr,
          time: kmToTime(dist),
          distKm: dist,
          category,
        });
      });

      // Sort by distance
      hospitals.sort((a, b) => a.distKm - b.distKm);

      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'hospitalsFound', hospitals })
      );
      return hospitals;
    }

    function openDir(lat, lng) {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'directions', lat, lng })
      );
    }

    // ── Main flow ────────────────────────────────────────────────────
    async function init() {
      try {
        const features = await searchHospitals(USER_LNG, USER_LAT, 10);

        if (features.length) {
          const placed = placeMarkers(features);

          // Fit map to show all hospitals + user
          if (placed.length === 1) {
            map.flyTo({ center: [placed[0].lng, placed[0].lat], zoom: 15, duration: 1200 });
          } else {
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend([USER_LNG, USER_LAT]);
            placed.forEach(h => bounds.extend([h.lng, h.lat]));
            map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 1200 });
          }
        } else {
          // Absolute fallback: zoom way out so natural map POIs are visible
          map.setZoom(10);
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'hospitalsFound', hospitals: [] })
          );
        }
      } catch (e) {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'error', message: e.message })
        );
      } finally {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
      }
    }

    map.on('load', init);
  </script>
</body>
</html>`;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerPress' && onMarkerPress) {
        onMarkerPress(data.id);
      } else if (data.type === 'hospitalsFound' && onHospitalsFound) {
        onHospitalsFound(data.hospitals);
      } else if (data.type === 'directions') {
        const { Linking } = require('react-native');
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}&travelmode=driving`
        );
      }
    } catch (_) {}
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  webview: { flex: 1, backgroundColor: 'transparent' },
});
