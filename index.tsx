import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// hljs is loaded from a CDN script in index.html and is available as a global.
declare const hljs: any;

// FIX: Prevent highlight.js debug logger from crashing on circular JSON structures.
// The debug plugin was trying to JSON.stringify a DOM element, which contains
// circular references (e.g., to React fibers), causing a crash. By replacing
// the logger, we can intercept payloads with DOM nodes and prevent serialization.
if (typeof hljs !== 'undefined') {
  // Replace the logger to avoid serializing DOM nodes. It logs '[HTMLElement]' instead.
  hljs.logger = {
    log: (...args: any[]) => console.log(...args.map(a => a instanceof HTMLElement ? '[HTMLElement]' : a)),
    warn: console.warn,
    error: console.error
  };
  // Also explicitly disable debug mode if the API exists on the loaded version.
  if (typeof hljs.debugMode === 'function') {
    hljs.debugMode(false);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
