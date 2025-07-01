# 🚗 Vehicle Tracker (Frontend)

This is the **frontend** of a real-time vehicle tracking app built with **React** and **Leaflet**. It displays a moving car icon on the map using live or simulated GPS data from a backend API.

## Live Demo

[https://vehicle-tracking-client.vercel.app/](https://vehicle-tracking-client.vercel.app/)

## Features

- 🗺️ Interactive map using **Leaflet** and **OpenStreetMap**
- 📍 Real-time vehicle movement with marker updates
- 🔁 Draws route history (polyline trail)
- 🔄 Start / Pause control
- 🧭 Auto-centering and direction-based marker rotation

## Technologies

- React
- React Leaflet
- Leaflet
- OpenStreetMap
- Fetch API for real-time updates

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/T3rex/Vehicle-Tracking-Client

   cd vehicle-tracker-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Set the API URL and INITIAL_POSITION (in src/utils/contants.jsx):

   ```javascript
   export const INITIAL_POSITION = [28.59029, 77.33654];

   export const FETCH_INTERVAL = 1000;

   export const LOCAL_API_URL = "http://localhost:5000/api/location";

   export const LIVE_API_URL =
     "https://vehicle-tracking-server-3xn2.onrender.com/api/location";
   ```

4. Configure the API URL in `src/utils/api.js`:

   - For local development, use `LOCAL_API_URL`.
   - For production or live data, use `LIVE_API_URL`.

   Adjust the `INITIAL_POSITION` to your desired starting point.

5. Start the development server:
   ```bash
   npm start
   ```

## Build for Production

Run this command to create a production build of the app:

```bash
npm run build
```

## Assets

Place your custom car icon in src/assets or adjust the path accordingly in your code.
