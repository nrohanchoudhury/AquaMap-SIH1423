import React from 'react';
import { useAqua } from '../context/AquaContext';
import {
  Map,
  PlusCircle,
  FileText,
  Users,
  BarChart3,
  Droplets,
  RotateCcw
} from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, complaints, resetToDefaultData } = useAqua();

  const activeComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;

  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => setActiveTab('map')}>
        <div className="brand-icon">
          <Droplets size={22} />
        </div>
        <div>
          <span className="brand-title">AquaMap</span>
        </div>
      </div>

      <nav className="nav-links">
        <button
          className={'nav-item ' + (activeTab === 'map' ? 'active' : '')}
          onClick={() => setActiveTab('map')}
        >
          <Map size={18} />
          <span>GIS Map</span>
        </button>

        <button
          className={'nav-item ' + (activeTab === 'submit' ? 'active' : '')}
          onClick={() => setActiveTab('submit')}
        >
          <PlusCircle size={18} />
          <span>Submit Issue</span>
        </button>

        <button
          className={'nav-item ' + (activeTab === 'complaints' ? 'active' : '')}
          onClick={() => setActiveTab('complaints')}
        >
          <FileText size={18} />
          <span>Complaints Log</span>
          {activeComplaintsCount > 0 && (
            <span className="nav-count-badge">{activeComplaintsCount}</span>
          )}
        </button>

        <button
          className={'nav-item ' + (activeTab === 'officers' ? 'active' : '')}
          onClick={() => setActiveTab('officers')}
        >
          <Users size={18} />
          <span>Field Teams</span>
        </button>

        <button
          className={'nav-item ' + (activeTab === 'analytics' ? 'active' : '')}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} />
          <span>Analytics</span>
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          className="reset-btn"
          onClick={resetToDefaultData}
          title="Reset to initial GIS mock dataset"
        >
          <RotateCcw size={14} />
          <span>Reset Data</span>
        </button>
      </div>
    </header>
  );
};
