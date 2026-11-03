import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'
import { ChatProvider } from '../context/ChatContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

// --- ADD THIS BLOCK ---
/// 1. Configure the settings
window.gtranslateSettings = {
  "default_language": "en",
  "detect_browser_language": true,
  "languages": ["en", "fr", "it", "de", "ja", "ar"],
  "wrapper_selector": ".gtranslate_wrapper",
  "flag_style": "3d",
  "alt_flags": { "en": "usa" }
};

// 2. Load the GTranslate script automatically
const script = document.createElement("script");
script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
script.defer = true;
document.head.appendChild(script);
/// --- END OF BLOCK ---

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)