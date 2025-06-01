
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MonitoringInitializer } from "./utils/monitoringInit";
import { preloadCriticalResources } from "./utils/performanceOptimization";
import { PRODUCTION_CONFIG } from "./config/production";

// Initialize monitoring and performance systems
MonitoringInitializer.init();

// Preload critical resources
if (PRODUCTION_CONFIG.enablePerformanceMonitoring) {
  preloadCriticalResources();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
