<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStore } from '@/store';
import type { Waypoint } from '@/interfaces/types';

const mapContainer = ref<HTMLElement | null>(null);
const store = useStore();
let map: L.Map;
let ugvMarker: L.Marker;
// Add a map to track waypoint markers
const waypointMarkers = ref<Map<string, L.Marker>>(new Map());

const ugvIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

onMounted(() => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value).setView([59.437, 24.7536], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    ugvMarker = L.marker([store.ugvPosition.lat, store.ugvPosition.lng], {
      icon: ugvIcon
    }).addTo(map);

    store.waypoints.forEach(waypoint => {
      addWaypointMarker(waypoint);
    });

    let pressTimer: number | null = null;

    const startPress = (event: L.LeafletMouseEvent) => {
      pressTimer = window.setTimeout(() => {
        handleLongPress(event);
      }, 700);
    };

    const cancelPress = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    map.on('mousedown', (e: L.LeafletMouseEvent) => startPress(e));
    map.on('mouseup', cancelPress);
    map.on('mouseout', cancelPress);

    map.on('touchstart', (e: L.LeafletEvent) => {
      if ('latlng' in e) {
        const simulatedEvent = {
          latlng: (e as any).latlng,
        } as L.LeafletMouseEvent;

        startPress(simulatedEvent);
      }
    });
    map.on('touchend', cancelPress);
  }
});


watch(() => store.waypoints, (newWaypoints, oldWaypoints) => {
  if (oldWaypoints) {
    // Rename - doesn't work
    newWaypoints.forEach(waypoint => {
      const oldWaypoint = oldWaypoints.find(w => w.id === waypoint.id);
      if (oldWaypoint && oldWaypoint.name !== waypoint.name) {
        updateWaypointMarker(waypoint);
      }
    });
    // Delete
    oldWaypoints.forEach(oldWaypoint => {
      if (!newWaypoints.find(w => w.id === oldWaypoint.id)) {
        removeWaypointMarker(oldWaypoint.id);
      }
    });
  }
}, { deep: true });

watch(() => store.ugvPosition, (newPosition) => {
  if (ugvMarker) {
    ugvMarker.setLatLng([newPosition.lat, newPosition.lng]);
    map.panTo([newPosition.lat, newPosition.lng]); // centering on UGV
  }
});


const addWaypointMarker = (waypoint: Waypoint) => {
  if (waypointMarkers.value.has(waypoint.id)) {
    return;
  }
  const marker = L.marker([waypoint.position.lat, waypoint.position.lng])
      .addTo(map)
      .bindPopup(`<b>${waypoint.name}</b>`);

  waypointMarkers.value.set(waypoint.id, marker);
  return marker;
};


const updateWaypointMarker = (waypoint: Waypoint) => {
  const marker = waypointMarkers.value.get(waypoint.id);
  if (marker) {
    marker.setPopupContent(`<b>${waypoint.name}</b>`);
    if (marker.isPopupOpen()) {
      marker.closePopup();
      marker.openPopup();
    }
  }
};


const removeWaypointMarker = (waypointId: string) => {
  const marker = waypointMarkers.value.get(waypointId);
  if (marker && map) {
    marker.remove();
    waypointMarkers.value.delete(waypointId);
  }
};


const handleLongPress = (event: L.LeafletMouseEvent) => {
  const position = {
    lat: event.latlng.lat,
    lng: event.latlng.lng
  };

  const tempMarker = L.marker([position.lat, position.lng]).addTo(map);

  const popupContent = document.createElement('div');
  popupContent.innerHTML = `
    <div class="waypoint-popup">
      <button id="drive-btn">Drive</button>
      <button id="save-btn">Save</button>
      <button id="discard-btn">Discard</button>
    </div>
  `;

  popupContent.querySelector('#drive-btn')?.addEventListener('click', () => {
    store.setUgvPosition(position);
    tempMarker.closePopup();
    tempMarker.remove();
  });

  popupContent.querySelector('#save-btn')?.addEventListener('click', () => {
    const waypoint = store.addWaypoint(position);

    tempMarker.closePopup();
    tempMarker.remove();
    addWaypointMarker(waypoint);
  });

  popupContent.querySelector('#discard-btn')?.addEventListener('click', () => {
    tempMarker.closePopup();
    tempMarker.remove();
  });

  tempMarker.bindPopup(popupContent).openPopup();
};
</script>

<template>
  <div id="map" ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
  width: 60%;
  height: 75vh;
  margin: 0 auto;
  border: 3px solid #b8cbff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.38);
}
</style>