<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useStore } from './store';
import MapView from './components/MapView.vue';
import EngineControl from './components/EngineControl.vue';
import WaypointsList from './components/WayPoints.vue';
import NotificationPopup from './components/Notification.vue';

const store = useStore();
const showNotification = ref(false);
const notificationMessage = ref('');

const handleKeyboard = (event: KeyboardEvent) => {
  let direction: 'up' | 'down' | 'left' | 'right' | null = null;

  switch (event.key) {
    case 'ArrowUp':
      direction = 'up';
      break;
    case 'ArrowDown':
      direction = 'down';
      break;
    case 'ArrowLeft':
      direction = 'left';
      break;
    case 'ArrowRight':
      direction = 'right';
      break;
  }

  if (direction) {
    const success = store.moveUgv(direction);

    if (!success) {
      notificationMessage.value = 'Please start the engine before moving the UGV';
      showNotification.value = true;
      setTimeout(() => {
        showNotification.value = false;
      }, 3000);
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyboard);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard);
});
</script>

<template>
  <div class="app">
    <div class="app-container">
      <MapView />
      <EngineControl />
      <WaypointsList />

      <NotificationPopup
          v-if="showNotification"
          :message="notificationMessage"
          @close="showNotification = false"
      />
    </div>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  background: white;
  background: radial-gradient(circle,rgba(255, 255, 255, 0.39) 54%, rgba(212, 212, 212, 1) 100%);
}

.app-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
