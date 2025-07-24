import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// 2. Extend the theme to include custom colors, fonts, etc
const theme = extendTheme({
  fonts: {
    heading: `'Bebas Neue', sans-serif`,
    body: `'Nunito', sans-serif`,
    // Optionally, you can define an accent font:
    accent: `'Pacifico', cursive`,
  },
});

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// Debug logging

if (!googleClientId) {
  console.error('REACT_APP_GOOGLE_CLIENT_ID is not defined in environment variables');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={theme}>
  {googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  ) : (
    <div style={{ padding: '20px', color: 'red' }}>
      <h2>Configuration Error</h2>
      <p>Google OAuth Client ID is not configured. Please check your .env file.</p>
    </div>
  )}
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
