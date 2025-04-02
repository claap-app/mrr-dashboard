import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MRRDashboard } from './pages/MRRDashboard';
import { ClientsDashboard } from './pages/ClientsDashboard';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="px-16">
          <div className="max-w-7xl mx-auto space-y-16">
            <Navigation />
            <Routes>
              <Route path="/" element={<MRRDashboard />} />
              <Route path="/clients" element={<ClientsDashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;