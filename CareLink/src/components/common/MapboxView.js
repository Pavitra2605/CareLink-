import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

/**
 * MapboxView — renders a Mapbox GL JS map inside a WebView.
 *
 * Props:
 *   hospitals      – array of { id, name, lat, lng, type, emergency, distance, time }
 *   center         – [lng, lat]  (defaults to first hospital or Chennai centre)
 *   zoom           – initial zoom level (default 12)
 *   style          – extra style for the outer container
 *   onMarkerPress  – callback(hospitalId) when a marker popup is opened
 */
export default function MapboxView({
  hospitals = [],
  center,
  zoom = 12,
  style,
  onMarkerPress,
}) {
  const webviewRef = useRef(null);

  const defaultCenter = center ||
    (hospitals.length > 0
      ? [hospitals[0].lng, hospitals[0].lat]
      : [80.2707, 13.0827]);

  /* ── HTML with embedded Mapbox GL JS ──────────────────────────────── */
  const hospitalsJSON = JSON.stringify(
    hospitals.map(h => ({
      id: h.id,
      name: h.name,
      distance: h.distance,
      time: h.time,
      type: h.type,
      emergency: h.emergency,
      lat: h.lat,
      lng: h.lng,
    }))
  );

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    #map { width: 100%; height: 100%; }

    /* Custom marker pin */
    .hospital-marker {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2.5px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.30);
    }
    .marker-government { background: #3B7FCC; }
    .marker-private    { background: #D94F4F; }
    .marker-phc        { background: #2E9E6B; }

    /* Popup overrides */
    .mapboxgl-popup-content {
      border-radius: 10px;
      padding: 10px 14px;
      font-family: -apple-system, sans-serif;
      max-width: 200px;
    }
    .popup-name  { font-weight: 700; font-size: 13px; color: #1A1A1A; margin-bottom: 4px; }
    .popup-meta  { font-size: 11px; color: #6B6B8A; display: flex; gap: 8px; margin-bottom: 5px; }
    .popup-badge {
      display: inline-block;
      background: #FDECEA;
      color: #D94F4F;
      font-size: 10px;
      font-weight: 600;
      border-radius: 4px;
      padding: 1px 5px;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    mapboxgl.accessToken = '${MAPBOX_TOKEN}';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [${defaultCenter[0]}, ${defaultCenter[1]}],
      zoom: ${zoom},
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');

    const hospitals = ${hospitalsJSON};

    function markerClass(type) {
      if (type === 'Government') return 'marker-government';
      if (type === 'PHC')        return 'marker-phc';
      return 'marker-private';
    }

    hospitals.forEach(h => {
      /* marker element */
      const el = document.createElement('div');
      el.className = 'hospital-marker ' + markerClass(h.type);
      el.innerHTML = '🏥';
      el.title = h.name;

      /* popup */
      const emergenceBadge = h.emergency
        ? '<span class="popup-badge">24/7 ER</span>'
        : '';
      const popup = new mapboxgl.Popup({ offset: 22, closeButton: false })
        .setHTML(
          '<div class="popup-name">' + h.name + '</div>' +
          '<div class="popup-meta">' +
            '<span>📍 ' + h.distance + '</span>' +
            '<span>🚗 ' + h.time + '</span>' +
          '</div>' +
          emergenceBadge
        );

      popup.on('open', () => {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'markerPress', id: h.id })
        );
      });

      new mapboxgl.Marker(el)
        .setLngLat([h.lng, h.lat])
        .setPopup(popup)
        .addTo(map);
    });
  </script>
</body>
</html>`;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerPress' && onMarkerPress) {
        onMarkerPress(data.id);
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
