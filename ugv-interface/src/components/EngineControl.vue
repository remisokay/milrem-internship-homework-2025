<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store';

const store = useStore();

const engineStatus = computed(() => store.engineStarted);

const toggleEngine = () => {
  store.toggleEngine();
};
</script>

<template>
  <button
      class="engine-button"
      @click="toggleEngine"
  >
    <i class="engine-icon"></i>
    {{ engineStatus ? 'Stop Engine' : 'Start Engine' }}
  </button>
</template>

<style scoped>
.engine-button {
  position: absolute;
  top: 0px;
  right: 175px;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: rgba(77, 77, 77, 0.8);
  border: 2px solid black;
  color: white;
  cursor: pointer;
  border-radius: 8px;
  z-index: 1000;
  transition: background-color 0.2s;
}
.engine-button:hover {
  background-color: rgba(131, 131, 131, 0.8);
}
.engine-button:active {
  background-color: rgba(184, 203, 255, 0.8);
  color: black;
}
</style>