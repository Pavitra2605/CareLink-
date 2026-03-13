import React, { useRef } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

/**
 * PharmacyMap — Mapbox GL JS based map that:
 *  - Centers on the user's GPS position (pulsing blue dot)
 *  - Searches Mapbox Search Box API for nearby pharmacies/drugstores
 *  - Places amber ⚕ pins for each result
 *  - Highlights a selected marker when highlightedId changes
 *  - Posts back { type:'pharmaciesFound', pharmacies[] } to React Native
 *  - Posts back { type:'markerPress', id } when a popup opens
 *  - Posts back { type:'directions', lat, lng } when "Get Directions" tapped
 *
 * Props:
 *   userLat           – latitude  (required)
 *   userLon           – longitude (required)
 *   highlightedId     – pharmacy id to highlight (optional)
 *   style             – extra style for outer container
 *   onMarkerPress     – callback(id)
 *   onPharmaciesFound – callback(pharmacies[])  ← new
 */
export default function PharmacyMap({
  userLat,
  userLon,
  highlightedId,
  style,
  onMarkerPress,
  onPharmaciesFound,
  // legacy compat — ignored (data now comes from Mapbox)
  pharmacies: _ignored,
}) {
  const webviewRef = useRef(null);

  // Highlight a marker from the list side
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
    html, body { width: 100%; height: 100%; overflow: hidden; background: #F5F4F0; }
    #map { width: 100%; height: 100%; }

    /* ── You-are-here pulsing dot ── */
    .user-dot {
      width: 18px; height: 18px;
      border-radius: 50%;
      background: #5B5A9E;
      border: 3px solid #fff;
      box-shadow: 0 0 0 0 rgba(91,90,158,0.5);
      animation: pulse 1.8s ease-out infinite;
    }
    @keyframes pulse {
      0%   { box-shadow: 0 0 0 0   rgba(91,90,158,0.55); }
      70%  { box-shadow: 0 0 0 14px rgba(91,90,158,0);   }
      100% { box-shadow: 0 0 0 0   rgba(91,90,158,0);    }
    }

    /* ── Pharmacy pin ── */
    .pharmacy-pin {
      width: 38px; height: 38px;
      border-radius: 50%;
      border: 2.5px solid #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.28);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
      background: #E8843A;
    }
    .pharmacy-pin:hover { transform: scale(1.12); }
    .pharmacy-pin.highlighted {
      transform: scale(1.22);
      box-shadow: 0 0 0 5px rgba(232,132,58,0.4), 0 2px 10px rgba(0,0,0,0.28);
      background: #C4682A;
    }

    /* ── Mapbox popup ── */
    .mapboxgl-popup-content {
      border-radius: 14px;
      padding: 12px 16px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 220px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.18);
    }
    .mapboxgl-popup-tip { border-top-color: #fff !important; }
    .p-name  { font-weight: 700; font-size: 13.5px; color: #1A1A1A; margin-bottom: 5px; }
    .p-meta  { font-size: 11.5px; color: #888; display: flex; gap: 10px; margin-bottom: 6px; }
    .p-badge {
      display: inline-block; background: #FFF3E8; color: #E8843A;
      font-size: 10px; font-weight: 700; border-radius: 4px; padding: 2px 7px;
      margin-bottom: 4px;
    }
    .p-price { font-size: 12px; color: #2E9E6B; font-weight: 700; margin-bottom: 2px; }
    .p-dir {
      margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;
      font-size: 12px; color: #5B5A9E; font-weight: 600;
      cursor: pointer; text-align: center;
    }
    .p-dir:hover { color: #E8843A; }

    /* ── Loading overlay ── */
    #loader {
      position: absolute; inset: 0;
      background: rgba(245,244,240,0.88);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      font-family: -apple-system, sans-serif;
      color: #E8843A; font-size: 13px; gap: 10px;
      z-index: 999;
    }
    .spinner {
      width: 28px; height: 28px;
      border: 3px solid rgba(232,132,58,0.2);
      border-top-color: #E8843A;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="loader"><div class="spinner"></div><span>Finding nearby pharmacies…</span></div>
  <script>
    const TOKEN    = '${MAPBOX_TOKEN}';
    const USER_LAT = ${userLat};
    const USER_LNG = ${userLon};

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

    // ── You-are-here marker ──────────────────────────────────────────────
    const userEl = document.createElement('div');
    userEl.className = 'user-dot';
    new mapboxgl.Marker({ element: userEl, anchor: 'center' })
      .setLngLat([USER_LNG, USER_LAT])
      .setPopup(new mapboxgl.Popup({ offset: 12, closeButton: false }).setHTML('<div class="p-name">📍 You are here</div>'))
      .addTo(map);

    // ── Haversine distance ───────────────────────────────────────────────
    function haversine(lat1, lng1, lat2, lng2) {
      const R = 6371, toRad = d => d * Math.PI / 180;
      const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
      const a = Math.sin(dLat/2)**2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
    function kmToTime(km) {
      const mins = Math.round((km / 20) * 60); // urban speed ~20 km/h
      return mins < 1 ? '1 min' : mins + ' min';
    }

    // ── Marker registry ──────────────────────────────────────────────────
    const markerMap = {}; // id -> { marker, el }

    function highlightMarker(id) {
      Object.entries(markerMap).forEach(([mid, { el, marker }]) => {
        el.classList.toggle('highlighted', mid === String(id));
        if (mid === String(id)) marker.getPopup() && marker.togglePopup();
      });
    }
    window.highlightMarker = highlightMarker;

    function clearMarkers() {
      Object.values(markerMap).forEach(({ marker }) => marker.remove());
      Object.keys(markerMap).forEach(k => delete markerMap[k]);
    }

    // ── Fetch pharmacies via Mapbox Search Box Category API ──────────────
    async function fetchCategory(category, limit) {
      const url =
        'https://api.mapbox.com/search/searchbox/v1/category/' + category +
        '?proximity=' + USER_LNG + ',' + USER_LAT +
        '&limit=' + limit +
        '&language=en' +
        '&access_token=' + TOKEN;
      try {
        const res  = await fetch(url);
        const data = await res.json();
        return (data.features || []).map(f => ({ ...f, _cat: category }));
      } catch (e) { return []; }
    }

    async function searchPharmacies() {
      let features = await fetchCategory('pharmacy', 10);
      if (features.length < 3) {
        const extra = await fetchCategory('drugstore', 8);
        features = features.concat(extra);
      }
      if (features.length < 3) {
        const extra2 = await fetchCategory('medical_clinic', 5);
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

    // ── Place markers and post list to React Native ──────────────────────
    function placeMarkers(features) {
      clearMarkers();
      const pharmacies = [];

      features.forEach((f, i) => {
        const [lng, lat] = f.geometry.coordinates;
        const p       = f.properties || {};
        const name    = p.name || p.text || (f.place_name || '').split(',')[0] || 'Pharmacy';
        const address = (p.place_formatted || p.address || '').split(',').slice(0,2).join(', ');
        const dist    = haversine(USER_LAT, USER_LNG, lat, lng);
        const distStr = dist < 1 ? (dist * 1000).toFixed(0) + ' m' : dist.toFixed(1) + ' km';
        const id      = 'ph' + i;

        // Marker element
        const el = document.createElement('div');
        el.className = 'pharmacy-pin';
        el.innerHTML = '⚕';

        // Popup
        const popup = new mapboxgl.Popup({ offset: 24, closeButton: false })
          .setHTML(
            '<div class="p-badge">⚕ Pharmacy</div>' +
            '<div class="p-name">' + name + '</div>' +
            (address ? '<div style="font-size:11px;color:#999;margin-bottom:5px;">' + address + '</div>' : '') +
            '<div class="p-meta">' +
              '<span>📍 ' + distStr + '</span>' +
              '<span>🚶 ' + kmToTime(dist) + '</span>' +
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

        pharmacies.push({
          id,
          name,
          address,
          latitude: lat,
          longitude: lng,
          distance: dist.toFixed(1),
          distanceStr: distStr,
          time: kmToTime(dist),
          distKm: dist,
          is_open: true, // Mapbox doesn't return hours; default open
        });
      });

      // Sort by distance
      pharmacies.sort((a, b) => a.distKm - b.distKm);

      // Post list back to React Native
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'pharmaciesFound', pharmacies })
      );

      return pharmacies;
    }

    function openDir(lat, lng) {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'directions', lat, lng })
      );
    }

    // ── Main init ────────────────────────────────────────────────────────
    async function init() {
      try {
        const features = await searchPharmacies();

        if (features.length) {
          const placed = placeMarkers(features);

          if (placed.length === 1) {
            map.flyTo({ center: [placed[0].longitude, placed[0].latitude], zoom: 15, duration: 1200 });
          } else {
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend([USER_LNG, USER_LAT]);
            placed.forEach(ph => bounds.extend([ph.longitude, ph.latitude]));
            map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 1200 });
          }
        } else {
          map.setZoom(12);
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'pharmaciesFound', pharmacies: [] })
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
      } else if (data.type === 'pharmaciesFound' && onPharmaciesFound) {
        onPharmaciesFound(data.pharmacies);
      } else if (data.type === 'directions') {
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}&travelmode=walking`
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
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMessage={handleMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  webview: { flex: 1, backgroundColor: 'transparent' },
});
