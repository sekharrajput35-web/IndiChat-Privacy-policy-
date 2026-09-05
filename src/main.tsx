import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { PortalProvider } from './context/PortalContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PortalProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </PortalProvider>
    </AuthProvider>
  </StrictMode>,
);
