import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Entry point for the React application.
 * 
 * - Uses React 18+ `createRoot` API for concurrent rendering.
 * - Wraps the app in `React.StrictMode` to help identify potential issues in development.
 */

// Select the root DOM element
const container = document.getElementById('root');

// Create the React root
const root = createRoot(container);

// Render the App component within StrictMode for dev warnings
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);