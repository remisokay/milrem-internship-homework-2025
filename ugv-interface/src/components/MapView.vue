<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStore } from '../store';

const mapContainer = ref<HTMLElement | null>(null);
const store = useStore();
let map: L.Map;
let ugvMarker: L.Marker;

onMounted(() => {
  if (mapContainer.value) {
    // Initialize map
    map = L.map(mapContainer.value).setView([51.505, -0.09], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add UGV marker
    ugvMarker = L.marker([store.ugvPosition.lat, store.ugvPosition.lng]).addTo(map);

    // Set up map events
    map.on('contextmenu', handleLongPress); // Right click for long press
  }
});

// Watch for UGV position changes
watch(() => store.ugvPosition, (newPosition) => {
  if (ugvMarker) {
    ugvMarker.setLatLng([newPosition.lat, newPosition.lng]);
    // Optional: center map on UGV
    // map.panTo([newPosition.lat, newPosition.lng]);
  }
});

// Handle right-click/long press to create waypoint
const handleLongPress = (event: L.LeafletMouseEvent) => {
  const position = {
    lat: event.latlng.lat,
    lng: event.latlng.lng
  };

  // Create a temporary marker
  const tempMarker = L.marker([position.lat, position.lng]).addTo(map);

  // Create popup with options
  const popupContent = document.createElement('div');
  popupContent.innerHTML = `
    <div class="waypoint-popup">
      <button id="drive-btn">Drive</button>
      <button id="save-btn">Save</button>
      <button id="discard-btn">Discard</button>
    </div>
  `;

  // Add event listeners
  popupContent.querySelector('#drive-btn')?.addEventListener('click', () => {
    store.setUgvPosition(position);
    tempMarker.closePopup();
    map.removeLayer(tempMarker);
  });

  popupContent.querySelector('#save-btn')?.addEventListener('click', () => {
    const waypoint = store.addWaypoint(position);
    tempMarker.closePopup();
    map.removeLayer(tempMarker);

    // Add a permanent marker for the waypoint
    const waypointMarker = L.marker([position.lat, position.lng])
        .addTo(map)
        .bindPopup(`<b>${waypoint.name}</b>`);
  });

  popupContent.querySelector('#discard-btn')?.addEventListener('click', () => {
    tempMarker.closePopup();
    map.removeLayer(tempMarker);
  });

  // Open popup
  tempMarker.bindPopup(popupContent).openPopup();
};
</script>

<template>
  <div id="map" ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
}
</style>