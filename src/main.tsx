import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Web3ProviderV2 } from './contexts/Web3ContextV2';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3ProviderV2>
      <App />
    </Web3ProviderV2>
  </StrictMode>
);
