import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMapEvents,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { useAqua } from '../context/AquaContext';
import {
  Layers,
  AlertTriangle,
  Zap,
  ShieldAlert,
  MapPin,
  CheckCircle,
  Crosshair,
  UserCheck,
  Cpu
} from 'lucide-react';

// Create custom Leaflet DivIcons to prevent missing PNG asset path issues in Vite
const createDivIcon = (htmlContent, className) => {
  return L.divIcon({
    html: htmlContent,
    className: 'custom-leaflet-marker ' + className,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const tankIcon = createDivIcon(
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  'marker-tank'
);

const pumpIcon = createDivIcon(
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  'marker-pump'
);

const complaintHighIcon = createDivIcon(
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>`,
  'marker-complaint-high'
);

const complaintMedIcon = createDivIcon(
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  'marker-complaint-med'
);

const complaintResolvedIcon = createDivIcon(
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  'marker-complaint-resolved'
);

const pinPickerIcon = createDivIcon(
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="#06b6d4" stroke="#ffffff" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>`,
  'marker-tank'
);

// Map Event Listener for Pin Picker
const LocationPickerEvents = ({ isPinPickerActive, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      if (isPinPickerActive) {
        onLocationSelect(e.latlng);
      }
    }
  });
  return null;
};

// Map Fly-To controller
const MapFlyTo = ({ selectedComplaint }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedComplaint && selectedComplaint.lat && selectedComplaint.lng) {
      map.flyTo([selectedComplaint.lat, selectedComplaint.lng], 15, {
        duration: 1.2
      });
    }
  }, [selectedComplaint, map]);
  return null;
};

export const MapView = () => {
  const {
    pipelines,
    tanks,
    officers,
    complaints,
    selectedComplaint,
    setSelectedComplaint,
    mapFilters,
    toggleMapFilter,
    isPinPickerActive,
    setIsPinPickerActive,
    selectedLocationForForm,
    setSelectedLocationForForm,
    setActiveTab,
    updateComplaintStatus
  } = useAqua();

  // Center on Vadodara urban GIS grid
  const defaultCenter = [22.305, 73.186];

  const handleLocationSelect = (latlng) => {
    setSelectedLocationForForm({
      lat: parseFloat(latlng.lat.toFixed(6)),
      lng: parseFloat(latlng.lng.toFixed(6))
    });
    setIsPinPickerActive(false);
    setActiveTab('submit');
  };

  return (
    <div className="map-view-container">
      {/* Sidebar Controls & Complaint Selector */}
      <aside className="map-sidebar">
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}
          >
            <Layers size={20} color="#06b6d4" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>GIS Map Overlays</h3>
          </div>

          <div className="filter-group">
            <label className="filter-checkbox">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: '#0284c7'
                  }}
                ></span>
                Pipelines Network
              </span>
              <input
                type="checkbox"
                checked={mapFilters.pipelines}
                onChange={() => toggleMapFilter('pipelines')}
              />
            </label>

            <label className="filter-checkbox">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#0284c7'
                  }}
                ></span>
                Water Tanks & Reservoirs
              </span>
              <input
                type="checkbox"
                checked={mapFilters.tanks}
                onChange={() => toggleMapFilter('tanks')}
              />
            </label>

            <label className="filter-checkbox">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#0d9488'
                  }}
                ></span>
                Booster Pump Stations
              </span>
              <input
                type="checkbox"
                checked={mapFilters.pumps}
                onChange={() => toggleMapFilter('pumps')}
              />
            </label>

            <label className="filter-checkbox">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#f43f5e'
                  }}
                ></span>
                Citizen Complaints
              </span>
              <input
                type="checkbox"
                checked={mapFilters.complaints}
                onChange={() => toggleMapFilter('complaints')}
              />
            </label>

            <label className="filter-checkbox">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: '#f43f5e',
                    border: '1px dashed #fff'
                  }}
                ></span>
                Defect Highlight Polyline
              </span>
              <input
                type="checkbox"
                checked={mapFilters.defectHighlight}
                onChange={() => toggleMapFilter('defectHighlight')}
              />
            </label>
          </div>
        </div>

        {/* Pin Location Picker Action */}
        <div className="card" style={{ padding: '16px', background: 'rgba(6, 182, 212, 0.08)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#06b6d4',
              marginBottom: '8px'
            }}
          >
            <Crosshair size={18} />
            <span>Map Pin Dropper</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '12px' }}>
            {isPinPickerActive
              ? 'Click anywhere on the map to select complaint location coordinates.'
              : 'Pick precise coordinates on the map to pre-fill the issue submission form.'}
          </p>
          <button
            className={isPinPickerActive ? 'btn-secondary' : 'btn-primary'}
            style={{ width: '100%', fontSize: '0.85rem' }}
            onClick={() => setIsPinPickerActive(!isPinPickerActive)}
          >
            {isPinPickerActive ? 'Cancel Pin Selection' : 'Drop Pin for New Issue'}
          </button>
        </div>

        {/* Selected Complaint Details Panel */}
        {selectedComplaint ? (
          <div className="card" style={{ padding: '16px', borderColor: 'var(--primary-aqua)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '10px'
              }}
            >
              <div>
                <span className="badge badge-critical">{selectedComplaint.id}</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginTop: '4px' }}>
                  {selectedComplaint.type}
                </h4>
              </div>
              <span
                className={'badge badge-' + (selectedComplaint.priority ? selectedComplaint.priority.toLowerCase() : 'medium')}
              >
                {selectedComplaint.priority} Priority
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '10px' }}>
              {selectedComplaint.description}
            </p>

            <div
              style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                marginBottom: '14px'
              }}
            >
              <div>
                <strong>Affected Pipe:</strong>{' '}
                <span style={{ color: '#06b6d4' }}>{selectedComplaint.pipelineName}</span>
              </div>
              <div>
                <strong>Status:</strong>{' '}
                <span style={{ textTransform: 'capitalize', color: '#f8fafc' }}>
                  {selectedComplaint.status}
                </span>
              </div>
              <div>
                <strong>Assigned Officer:</strong>{' '}
                {officers.find((o) => o.id === selectedComplaint.assignedOfficerId)?.name ||
                  'Eng. Rajesh Kumar'}
              </div>
            </div>

            {selectedComplaint.aiRecommendation && (
              <div
                style={{
                  background: 'rgba(13, 148, 136, 0.15)',
                  border: '1px solid rgba(13, 148, 136, 0.4)',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '0.78rem',
                  marginBottom: '12px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#2dd4bf',
                    fontWeight: 700,
                    marginBottom: '4px'
                  }}
                >
                  <Cpu size={14} /> AI Recommendation
                </div>
                <div style={{ color: '#99f6e4' }}>{selectedComplaint.aiRecommendation}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedComplaint.status !== 'Resolved' ? (
                <button
                  className="btn-primary"
                  style={{ flex: 1, fontSize: '0.8rem', padding: '8px' }}
                  onClick={() => updateComplaintStatus(selectedComplaint.id, 'Resolved')}
                >
                  <CheckCircle size={14} /> Mark Resolved
                </button>
              ) : (
                <div
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    color: '#10b981',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  ✓ Issue Fully Resolved
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="card"
            style={{
              padding: '16px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '0.85rem'
            }}
          >
            Click any marker or complaint on the map to inspect spatial attributes.
          </div>
        )}
      </aside>

      {/* Main Leaflet GIS Map Canvas */}
      <div className="map-wrapper">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | AquaMap GIS'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationPickerEvents
            isPinPickerActive={isPinPickerActive}
            onLocationSelect={handleLocationSelect}
          />
          <MapFlyTo selectedComplaint={selectedComplaint} />

          {/* Render Pipelines (Polylines) */}
          {mapFilters.pipelines &&
            pipelines.map((pipe) => {
              const isAffected =
                mapFilters.defectHighlight &&
                selectedComplaint &&
                selectedComplaint.pipelineId === pipe.id &&
                selectedComplaint.status !== 'Resolved';

              return (
                <Polyline
                  key={pipe.id}
                  positions={pipe.coords}
                  pathOptions={{
                    color: isAffected ? '#f43f5e' : '#0284c7',
                    weight: isAffected ? 7 : 4,
                    dashArray: isAffected ? '12, 12' : null,
                    opacity: isAffected ? 0.95 : 0.75,
                    className: isAffected ? 'pulsing-defect-line' : ''
                  }}
                >
                  <Popup>
                    <div style={{ padding: '4px', minWidth: '180px' }}>
                      <h4 style={{ color: '#0f172a', fontWeight: 800 }}>{pipe.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#475569', margin: '4px 0' }}>
                        ID: {pipe.id} | Zone: {pipe.zone}
                      </p>
                      <hr style={{ margin: '6px 0', borderTop: '1px solid #e2e8f0' }} />
                      <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                        <div>
                          <strong>Diameter:</strong> {pipe.diameter}
                        </div>
                        <div>
                          <strong>Material:</strong> {pipe.material}
                        </div>
                        <div>
                          <strong>Operating Pressure:</strong> {pipe.pressure}
                        </div>
                        {isAffected && (
                          <div
                            style={{
                              color: '#e11d48',
                              fontWeight: 700,
                              marginTop: '4px',
                              background: '#ffe4e6',
                              padding: '4px',
                              borderRadius: '4px'
                            }}
                          >
                            ⚠️ Active Defect Highlighted
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              );
            })}

          {/* Render Water Tanks & Pumps */}
          {tanks.map((item) => {
            const isPump = item.type.includes('Pump');
            if (isPump && !mapFilters.pumps) return null;
            if (!isPump && !mapFilters.tanks) return null;

            return (
              <Marker
                key={item.id}
                position={[item.lat, item.lng]}
                icon={isPump ? pumpIcon : tankIcon}
              >
                <Popup>
                  <div style={{ padding: '4px', minWidth: '190px' }}>
                    <span
                      style={{
                        background: isPump ? '#0d9488' : '#0284c7',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      {item.type}
                    </span>
                    <h4 style={{ color: '#0f172a', fontWeight: 800, marginTop: '4px' }}>
                      {item.name}
                    </h4>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#475569',
                        marginTop: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <div>
                        <strong>Capacity / Spec:</strong> {item.capacity}
                      </div>
                      <div>
                        <strong>Current Level / Output:</strong> {item.currentLevel}
                      </div>
                      <div>
                        <strong>Status:</strong> {item.status}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Render Complaint Markers */}
          {mapFilters.complaints &&
            complaints.map((cmp) => {
              let icon = complaintHighIcon;
              if (cmp.status === 'Resolved') icon = complaintResolvedIcon;
              else if (cmp.priority === 'Medium' || cmp.priority === 'Normal')
                icon = complaintMedIcon;

              return (
                <Marker
                  key={cmp.id}
                  position={[cmp.lat, cmp.lng]}
                  icon={icon}
                  eventHandlers={{
                    click: () => setSelectedComplaint(cmp)
                  }}
                >
                  <Popup>
                    <div style={{ padding: '4px', minWidth: '200px' }}>
                      <span
                        style={{
                          background: cmp.status === 'Resolved' ? '#10b981' : '#f43f5e',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        {cmp.id} - {cmp.priority} Priority
                      </span>
                      <h4 style={{ color: '#0f172a', fontWeight: 800, marginTop: '4px' }}>
                        {cmp.type}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#475569', margin: '4px 0' }}>
                        {cmp.description}
                      </p>
                      <div
                        style={{ fontSize: '0.75rem', color: '#64748b', margin: '6px 0 8px 0' }}
                      >
                        <strong>Near:</strong> {cmp.pipelineName}
                      </div>
                      <button
                        style={{
                          width: '100%',
                          background: '#0284c7',
                          color: 'white',
                          border: 'none',
                          padding: '6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.78rem'
                        }}
                        onClick={() => setSelectedComplaint(cmp)}
                      >
                        Highlight Pipeline Segment
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Display Temporary Pin Picker Marker */}
          {selectedLocationForForm && (
            <Marker
              position={[selectedLocationForForm.lat, selectedLocationForForm.lng]}
              icon={pinPickerIcon}
            >
              <Popup>Selected Location for Issue Submission</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};
