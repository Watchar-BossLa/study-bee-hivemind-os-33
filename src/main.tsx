
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ProductionInitializer } from "./utils/productionInit";
import { ProductionTester } from "./utils/productionTesting";
import { ENVIRONMENT, isProduction, isDevelopment } from "./config/environment";

// Initialize production systems
const initializeApp = async () => {
  try {
    // Initialize production systems
    await ProductionInitializer.initialize();
    
    // Log system status
    ProductionInitializer.logSystemStatus();
    
    // Render the app first
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    
    // Run comprehensive tests in development after app is fully loaded
    if (isDevelopment()) {
      // Wait for the app to fully load before running tests
      setTimeout(async () => {
        console.log('🔄 Starting enhanced auth and production tests...');
        await ProductionTester.runComprehensiveTests();
      }, 3000); // Reduced delay for faster feedback
    }
    
  } catch (error) {
    console.error('Failed to initialize application:', error);
    
    // Fallback rendering
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        fontFamily: 'system-ui' 
      }}>
        <h1>🐝 Study Bee</h1>
        <p>Application is starting up...</p>
        <p style={{ fontSize: '0.8em', color: '#666' }}>
          If this message persists, please refresh the page.
        </p>
      </div>
    );
  }
};

// Start the application
initializeApp();
