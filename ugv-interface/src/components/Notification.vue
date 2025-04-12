<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

const closeNotification = () => {
  emit('close');
};
</script>

<template>
  <div class="notification-popup">
    <div class="notification-content">
      <span class="notification-message">{{ props.message }}</span>
      <button class="close-button" @click="closeNotification">×</button>
    </div>
  </div>
</template>

<style scoped>
.notification-popup {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(77, 77, 77, 0.8);
  color: white;
  border-radius: 4px;
  border: 1px solid black;
  padding: 12px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  max-width: 400px;
  animation: fadeIn 0.3s ease-out;
}

.notification-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notification-message {
  font-size: 14px;
  line-height: 1.4;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  transition: opacity 0.2s;
}

</style>