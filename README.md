# Interface prototype for an UGV system

This is a home assignment application for Milrem Robotics internship 2025.

A prototype interface for controlling an Unmanned Ground Vehicle (UGV) system.
Integrates a digital map to display the UGV’s location, allowing users to interact 
with the UGV through a set of controls.

## Key Features

* UGV’s engine can be started/stopped by using a <b>control button</b>. The UGV won't move when the engine is stopped

* UGV marker can be moved around the map by using <b>keyboard arrow keys</b>

* You can <b>add, save, rename and delete</b> waypoints on the map

* The UGV can be <b>moved</b> to the waypoint, if the engine is on

* Alerts appear when trying to move the UGV without starting the engine

## Setup
```
git clone https://github.com/remisokay/milrem-internship-homework-2025.git

cd ugv-interface
npm install
npm run dev
```

## Tech stack
* Vue 3
* TypeScript
* Html & CSS
* Leaflet map: https://leafletjs.com/
* Created with help of Claude 3.7 Sonnet and ChatGPT