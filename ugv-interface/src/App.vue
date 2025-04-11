<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useStore } from './store';
import MapView from './components/MapView.vue';
// import EngineControl from './components/EngineControl.vue';
// import WaypointsList from './components/WaypointsList.vue';
// import NotificationPopup from './components/NotificationPopup.vue';

const store = useStore();
// const showNotification = ref(false);
// const notificationMessage = ref('');

// Handle keyboard events
const handleKeyDown = (event: KeyboardEvent) => {
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

    // if (!success) {
    //   // Show notification
    //   notificationMessage.value = 'Please start the engine before moving the UGV';
    //   showNotification.value = true;
    //
    //   // Hide notification after 3 seconds
    //   setTimeout(() => {
    //     showNotification.value = false;
    //   }, 3000);
    // }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="app">
    <MapView />
<!--    <EngineControl />-->
<!--    <WaypointsList />-->

<!--    <NotificationPopup-->
<!--        v-if="showNotification"-->
<!--        :message="notificationMessage"-->
<!--        @close="showNotification = false"-->
<!--    />-->
  </div>
</template>

<style scoped>
.app {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
