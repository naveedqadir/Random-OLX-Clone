import React, { useState, useEffect, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { getSafeImageUrl } from './utils/imageUtils';

// Global variable to track active instance
let activeInstance = null;
let mountedInstances = new Set();

function GoogleSignIn({ isVisible = true }) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canRender, setCanRender] = useState(false);
  const componentId = useRef(Math.random().toString(36).substr(2, 9));
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const instanceId = componentId.current;
    mountedInstances.add(instanceId);

    if (isVisible) {
      // If no active instance or this is the active instance
      if (!activeInstance || activeInstance === instanceId) {
        activeInstance = instanceId;
        setCanRender(true);
        
      } else {
        setCanRender(false);
        
      }
    } else {
      // If this was the active instance, clear it
      if (activeInstance === instanceId) {
        activeInstance = null;
        
      }
      setCanRender(false);
    }

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      mountedInstances.delete(instanceId);
      if (activeInstance === instanceId) {
        activeInstance = null;
        // Find next available instance to activate
        const nextInstance = Array.from(mountedInstances)[0];
        if (nextInstance) {
          activeInstance = nextInstance;
        }
      }
    };
  }, [isVisible]);
 
 const responseMessage = (response) => {
    if (!mountedRef.current) return;
    
    
    setError(null);
    setIsLoading(true);
    
   axios.post(`${backendUrl}/google-auth`, {
     credential: response.credential,
   })
   .then(response => {
     if (!mountedRef.current) return;
     
     
     localStorage.setItem('authToken', response.data.token);
     localStorage.setItem('authemail', response.data.email);
     localStorage.setItem('authname', response.data.name);
     localStorage.setItem('authphone', response.data.phone);
     localStorage.setItem('authpicture', getSafeImageUrl(response.data.picture, 96));
     window.location.href = '/';
   })
   .catch(error => {
     if (!mountedRef.current) return;
     
     console.error('Backend auth error:', error);
     setError('Failed to authenticate with backend');
     setIsLoading(false);
   });
 };
 
 const errorMessage = (error) => {
   if (!mountedRef.current) return;
   
   console.error('Google OAuth error:', error);
   setError('Google authentication failed. Please check the console for details.');
   setIsLoading(false);
 };

 // Only render if visible, we can render, and we're the active instance
 if (!isVisible || !canRender || activeInstance !== componentId.current) {
   return null;
 }
 
    return (
        <div key={componentId.current}>
            {error && (
              <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
                {error}
              </div>
            )}
            {isLoading ? (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                Signing in...
              </div>
            ) : (
              <GoogleLogin 
                onSuccess={responseMessage} 
                onError={errorMessage}
                useOneTap={false}
                auto_select={false}
                cancel_on_tap_outside={true}
                theme="outline"
                size="large"
                text="signin"
                shape="rectangular"
              />
            )}
        </div>
    )
}
export default GoogleSignIn;