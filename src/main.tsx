import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import hljs from 'highlight.js';

// FIX: Prevent highlight.js debug logger from crashing on circular JSON structures.
// The debug plugin was trying to JSON.stringify a DOM element, which contains
// circular references (e.g., to React fibers), causing a crash. By replacing
// the logger, we can intercept payloads with DOM nodes and prevent serialization.
(hljs as any).logger = {
  log: (...args: any[]) => console.log(...args.map(a => a instanceof HTMLElement ? '[HTMLElement]' : a)),
  warn: console.warn,
  error: console.error
};
// Also explicitly disable debug mode if the API exists on the loaded version.
if (typeof (hljs as any).debugMode === 'function') {
  (hljs as any).debugMode(false);
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
