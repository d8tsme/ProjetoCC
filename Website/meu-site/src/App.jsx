import React from 'react';
import './index.css';
import HeaderPage from './components/pages/HeaderPage';
import BannerPage from './components/pages/BannerPage';
import ServicesPage from './components/pages/ServicesPage';
import ContactFormPage from './components/pages/ContactFormPage';

export default function App() {
  return (
    <div className="app-container">
      <HeaderPage />
      <main className="main-content">
        <BannerPage />
        <ServicesPage />
        <ContactFormPage />
      </main>
    </div>
  );
  
}
