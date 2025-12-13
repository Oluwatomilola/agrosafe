import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Web3Provider } from './providers/Web3Provider';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>,
);