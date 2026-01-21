import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
} catch (e) {
    console.error("React Mount Error:", e);
    document.getElementById('root').innerHTML = `<div style="color:red; padding:20px;">Failed to mount application: ${e.message}</div>`;
}