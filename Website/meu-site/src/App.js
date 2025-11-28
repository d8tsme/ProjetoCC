import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Banner from './components/Banner/Banner';
import Services from './components/Services';
import ContactForm from './components/Contact/ContactForm';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Banner />
        <Services />
        <ContactForm />
      </main>
    </div>
  );
}

export default App;
