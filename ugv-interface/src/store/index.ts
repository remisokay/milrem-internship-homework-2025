import { defineStore } from 'pinia';
import type { Position, Waypoint } from '@/interfaces/types';


export const useStore = defineStore('ugvStore', {
    state: () => ({
        engineStarted: false,
        ugvPosition: { lat: 59.437, lng: 24.7536 } as Position,
        waypoints: [] as Waypoint[],
        selectedWaypoint: null as Waypoint | null
    }),

    actions: {
        toggleEngine() {
            this.engineStarted = !this.engineStarted;
        },

        setUgvPosition(position: Position) {
            this.ugvPosition = position;
        },

        moveUgv(direction: 'up' | 'down' | 'left' | 'right') {
            if (!this.engineStarted) {
                return false;
            }

            const step = 0.0005;

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

            return true;
        },

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

        driveToWaypoint(waypoint: Waypoint) {
            if (this.engineStarted) {
                this.ugvPosition = { ...waypoint.position };
                return true;
            }
            return false;
        }
    }
});