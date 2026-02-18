import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gemstones from './pages/Gemstones';

function App() {
  return (
    <div className="min-h-screen bg-light font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gemstones" element={<Gemstones />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
