import React from 'react';
import { AquaProvider, useAqua } from './context/AquaContext';
import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { ComplaintForm } from './components/ComplaintForm';
import { ComplaintList } from './components/ComplaintList';
import { OfficerDashboard } from './components/OfficerDashboard';
import { Analytics } from './components/Analytics';
import { ToastContainer } from './components/Toast';

const MainApp = () => {
  const { activeTab } = useAqua();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {activeTab === 'map' && <MapView />}
        {activeTab === 'submit' && <ComplaintForm />}
        {activeTab === 'complaints' && <ComplaintList />}
        {activeTab === 'officers' && <OfficerDashboard />}
        {activeTab === 'analytics' && <Analytics />}
      </main>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AquaProvider>
      <MainApp />
    </AquaProvider>
  );
}
