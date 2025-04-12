<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import { useStore } from '@/store';
import type { Waypoint } from '@/interfaces/types.ts';
import NotificationPopup from './Notification.vue';


const store = useStore();
const waypoints = computed(() => store.waypoints);
const selectedWaypoint = ref<Waypoint | null>(null);
const isRenaming = ref(false);
const newName = ref('');
const renameInput = ref<HTMLInputElement | null>(null);
const showNotification = ref(false);
const notificationMessage = ref('');


const formatedCord = (position: { lat: number, lng: number }) => {
  return `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`;
};

const selectWaypoint = (waypoint: Waypoint) => {
  selectedWaypoint.value = waypoint;
  isRenaming.value = false;
};


const driveToWaypoint = () => {
  if (selectedWaypoint.value) {
    const success = store.driveToWaypoint(selectedWaypoint.value);

    if (!success) {
      notificationMessage.value = 'Please start the engine before moving the UGV';
      showNotification.value = true;
      setTimeout(() => {
        showNotification.value = false;
      }, 3000);
    }
    selectedWaypoint.value = null;
  }
};

const deleteWaypoint = () => {
  if (selectedWaypoint.value) {
    store.deleteWaypoint(selectedWaypoint.value.id);
    selectedWaypoint.value = null;
  }
};

const startRenameMode = () => {
  if (selectedWaypoint.value) {
    newName.value = selectedWaypoint.value.name;
    isRenaming.value = true;

    nextTick(() => {
      if (renameInput.value) {
        renameInput.value.focus();
      }
    });
  }
};

const saveNewName = () => {
  if (selectedWaypoint.value && newName.value.trim()) {
    store.renameWaypoint(selectedWaypoint.value.id, newName.value.trim());
    isRenaming.value = false;
  }
};

const cancelRename = () => {
  isRenaming.value = false;
};
</script>

<template>
  <div class="waypoints-container">
    <h3>Saved Waypoints</h3>

    <div v-if="waypoints.length === 0" class="no-waypoints">
      No saved waypoints yet.<br>
      Long press on the map to create one.
    </div>

    <ul v-else class="waypoints-list">
      <li
          v-for="waypoint in waypoints"
          :key="waypoint.id"
          class="waypoint-item"
          @click="selectWaypoint(waypoint)"
      >
        <span class="waypoint-name">{{ waypoint.name }}</span>
        <span class="waypoint-coords">
          {{ formatedCord(waypoint.position) }}
        </span>
      </li>
    </ul>

    <!-- Popup for waypoint actions -->
    <div v-if="selectedWaypoint" class="waypoint-actions-popup">
      <div class="popup-header">
        <h4>{{ selectedWaypoint.name }}</h4>
        <button class="close-btn" @click="selectedWaypoint = null">&times;</button>
      </div>

      <div class="popup-content">
        <div class="coordinates">
          {{ formatedCord(selectedWaypoint.position) }}
        </div>

        <div class="actions">
          <button class="action-btn drive" @click="driveToWaypoint">
            Drive
          </button>
          <button class="action-btn rename" @click="startRenameMode">
            Rename
          </button>
          <button class="action-btn delete" @click="deleteWaypoint">
            Delete
          </button>
        </div>

        <!-- Rename form -->
        <div v-if="isRenaming" class="rename-form">
          <input
              type="text"
              v-model="newName"
              class="rename-input"
              ref="renameInput"
          />
          <div class="rename-actions">
            <button class="save-btn" @click="saveNewName">Save</button>
            <button class="cancel-btn" @click="cancelRename">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <NotificationPopup
      v-if="showNotification"
      :message="notificationMessage"
      @close="showNotification = false"
  />
</template>

<style scoped>
.waypoints-container {
  position: absolute;
  top: 0;
  left: 10px;
  width: 250px;
  height: 73vh;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

h3 {
  margin: 0;
  padding: 15px;
  border-bottom: 1px solid #c7cfff;
  font-size: 16px;
  font-weight: 600;
}

.no-waypoints {
  padding: 15px;
  color: #4d4d4d;
  font-style: italic;
  font-size: 14px;
}

.waypoints-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.waypoint-item {
  padding: 12px 15px;
  border-bottom: 1px solid #c7cfff;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
}

.waypoint-item:hover {
  background-color: #ebeeff;
}

.waypoint-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.waypoint-coords {
  font-size: 12px;
}

/* Popups */
.waypoint-actions-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1100;
}

.popup-header {
  padding: 15px;
  border-bottom: 1px solid #c7cfff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-header h4 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #420b0b;
}

.popup-content {
  padding: 15px;
}

.coordinates {
  margin-bottom: 15px;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  background-color: rgba(77, 77, 77, 0.8);
  color: white;
  border: 1px solid black;
}

.action-btn:hover {
  background-color: rgba(131, 131, 131, 0.8);
}

/* Rename form */
.rename-form {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #c7cfff;
}

.rename-input {
  width: 92%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.rename-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.save-btn, .cancel-btn {
  padding: 6px 12px;
  border: 1px solid black;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover, .cancel-btn:hover {
  opacity: 0.8;
}

.save-btn {
  background-color: #b8cbff;
  color: black;
}

.cancel-btn {
  background-color: rgba(77, 77, 77, 0.8);
  color: white;
}
</style>