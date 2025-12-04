import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";

// Auth Components
import Modallogin from "./components/auth/Modallogin";

// Common Components
import Loading from "./components/common/Loading";
import NotFound from "./components/common/NotFound";
import MaintenancePage from "./components/common/MaintenancePage";

// Feature: Ads
import PreviewAd from "./features/ads/PreviewAd";
import CatagoryView from "./features/ads/CatagoryView";
import Myads from "./features/ads/Myads";

// Feature: Sell
import Sell from "./features/sell/Sell";
import SellForm from "./features/sell/SellForm";
import AdSuccess from "./features/sell/AdSuccess";

// Feature: Profile
import UserProfileEdit from "./features/profile/UserProfileEdit";
import Profile from "./features/profile/Profile";
import SearchProfile from "./features/profile/SearchProfile";

// Feature: Search
import SearchResults from "./features/search/SearchResults";

// Feature: Chat
import MyChat from "./features/chat/MyChat";

// Feature: Admin
import AdminDashboard from "./features/admin/AdminDashboard";


function App() {
  // for modal 
  const [staticModal, setStaticModal] = useState(true);
  const toggleShow = () => setStaticModal(!staticModal);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [backendStatus, setBackendStatus] = useState('online'); // Track backend status


  async function checkBackendStatus() {
    try {
      const response = await fetch(`${backendUrl}/api/check-status`);
      const data = await response.json();
      setBackendStatus(data.status);
    } catch (error) {
      setBackendStatus('offline');
    } finally {
      setLoading(false);
    }
  }

  // Function to check user authentication status
  async function checkAuthentication() {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        
        return;
      }
      const response = await fetch(`${backendUrl}/auth-endpoint`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await response.json();

      if (data.isAuthenticated) {
        
        setAuth(true)
      } else {
        
        setAuth(false)
      }
    } catch (error) {
      console.error(error);
    }
     finally {
      // Authentication check is complete, update loading state
      setLoading(false);
    }
  }
  

  useEffect(() => {
    checkBackendStatus();
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    if (loading) {
    return <Loading />;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">

        {/* USE NAVBAR */}
        <Navbar auth={auth} setAuth={setAuth} />

        {/* routes */}
        {backendStatus === 'online' ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/adsuccess" element={<AdSuccess />} />
            <Route path="/preview_ad/:id" element={<PreviewAd auth={auth} />} />
            <Route path="/attributes/:category/:item" element={<SellForm />} />
            {auth === true && <Route path="/chat/:id/:useremail" element={<MyChat />} />}
            {auth === true && <Route path="/chat" element={<MyChat />} />}
            {auth === true && <Route path="/editprofile" element={<UserProfileEdit />} />}
            {auth === true && <Route path="/profile" element={<Profile />} />}
            {auth === true && <Route path="/myads" element={<Myads />} />}
            {auth === true && <Route path="/sell" element={<Sell />} />}
            {auth === true && <Route path="/admin" element={<AdminDashboard />} />}
            {auth === false && <Route path="/sell" element={[<Modallogin setStaticModal={setStaticModal} toggleShow={toggleShow} staticModal={staticModal} />, <Home />]} />}
            <Route path="/:category" element={<CatagoryView />} />
            <Route path="/results" element={<SearchResults />} />
            <Route path="/profile/:useremail" element={<SearchProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        ) : (
          // Render the maintenance page when the backend is down
          <MaintenancePage />
        )}

        {/* USE FOOTER */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;