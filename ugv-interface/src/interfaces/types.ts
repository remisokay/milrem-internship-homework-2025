

export interface Position {
    lat: number;
    lng: number;
}

export interface Waypoint {
    id: string;
    position: Position;
    name: string;
}
