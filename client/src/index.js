import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// World-class modern theme
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    success: {
      500: '#22c55e',
      600: '#16a34a',
    },
    warm: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
    },
  },
  fonts: {
    heading: `'Plus Jakarta Sans', 'Inter', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
  shadows: {
    soft: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 8px 30px 0 rgba(0, 0, 0, 0.08)',
    glow: '0 0 40px rgba(14, 165, 233, 0.15)',
    card: '0 1px 3px rgba(0,0,0,0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'xl',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' : 
              props.colorScheme === 'accent' ? 'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)' : undefined,
          color: 'white',
          boxShadow: 'lg',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'xl',
            bg: props.colorScheme === 'brand' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 
                props.colorScheme === 'accent' ? 'linear-gradient(135deg, #c026d3 0%, #a21caf 100%)' : undefined,
          },
          _active: {
            transform: 'translateY(0)',
          },
        }),
        outline: {
          borderWidth: '2px',
          _hover: {
            bg: 'brand.50',
          },
        },
        ghost: {
          _hover: {
            bg: 'brand.50',
          },
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          _hover: {
            bg: 'rgba(255, 255, 255, 1)',
            boxShadow: 'lg',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          boxShadow: 'card',
          bg: 'white',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'gray.50',
            borderRadius: 'xl',
            border: '2px solid transparent',
            _hover: {
              bg: 'gray.100',
            },
            _focus: {
              bg: 'white',
              borderColor: 'brand.500',
              boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.15)',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Menu: {
      baseStyle: {
        list: {
          borderRadius: '2xl',
          boxShadow: 'xl',
          border: 'none',
          p: 2,
        },
        item: {
          borderRadius: 'lg',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 3,
        py: 1,
        fontWeight: '600',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '700',
        letterSpacing: '-0.02em',
      },
    },
  },
});

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

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
