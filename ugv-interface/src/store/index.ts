import { defineStore } from 'pinia';

// Define interfaces for our data types
export interface Position {
    lat: number;
    lng: number;
}

export interface Waypoint {
    id: string;
    position: Position;
    name: string;
}

// Create and export the store
export const useStore = defineStore('ugvStore', {
    state: () => ({
        // UGV state
        engineStarted: false,
        ugvPosition: { lat: 51.505, lng: -0.09 } as Position,
        waypoints: [] as Waypoint[],
        selectedWaypoint: null as Waypoint | null
    }),

    actions: {
        // Engine controls
        toggleEngine() {
            this.engineStarted = !this.engineStarted;
        },

        // Position controls
        setUgvPosition(position: Position) {
            this.ugvPosition = position;
        },

        // Move UGV in a direction
        moveUgv(direction: 'up' | 'down' | 'left' | 'right') {
            if (!this.engineStarted) {
                return false; // Engine not started
            }

            const step = 0.0005; // Adjust step size as needed

            switch (direction) {
                case 'up':
                    this.ugvPosition = { ...this.ugvPosition, lat: this.ugvPosition.lat + step };
                    break;
                case 'down':
                    this.ugvPosition = { ...this.ugvPosition, lat: this.ugvPosition.lat - step };
                    break;
                case 'left':
                    this.ugvPosition = { ...this.ugvPosition, lng: this.ugvPosition.lng - step };
                    break;
                case 'right':
                    this.ugvPosition = { ...this.ugvPosition, lng: this.ugvPosition.lng + step };
                    break;
            }

            return true; // Movement successful
        },

        // Waypoint management
        addWaypoint(position: Position, name: string = 'New Waypoint') {
            const id = `waypoint-${Date.now()}`;
            const waypoint = { id, position, name };
            this.waypoints.push(waypoint);
            return waypoint;
        },

        deleteWaypoint(id: string) {
            this.waypoints = this.waypoints.filter(w => w.id !== id);
        },

        renameWaypoint(id: string, newName: string) {
            const waypoint = this.waypoints.find(w => w.id === id);
            if (waypoint) {
                waypoint.name = newName;
            }
        },

        selectWaypoint(waypoint: Waypoint | null) {
            this.selectedWaypoint = waypoint;
        },

        driveToWaypoint(waypoint: Waypoint) {
            if (this.engineStarted) {
                this.ugvPosition = { ...waypoint.position };
                return true;
            }
            return false;
        }
    }
});