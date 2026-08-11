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
  MapPin,
  CheckCircle,
  Crosshair,
  ShieldCheck,
  Activity
} from 'lucide-react';

// Create custom Leaflet DivIcons for clean asset-free rendering
const createDivIcon = (htmlContent, className) => {
  return L.divIcon({
    html: htmlContent,
    className: 'custom-leaflet-marker ' + className,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const tankIcon = createDivIcon(
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  'marker-tank'
);

const pumpIcon = createDivIcon(
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  'marker-pump'
);

const complaintHighIcon = createDivIcon(
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>`,
  'marker-complaint-high'
);

const complaintMedIcon = createDivIcon(
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  'marker-complaint-med'
);

const complaintResolvedIcon = createDivIcon(
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  'marker-complaint-resolved'
);

const pinPickerIcon = createDivIcon(
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="#2563a6" stroke="#ffffff" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>`,
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
        duration: 1.0
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
      {/* Sidebar Controls & Operational Details */}
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
            <Layers size={18} color="#16324f" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16324f' }}>
              GIS Layer Controls
            </h3>
          </div>

          <div className="filter-group">
            <label className="filter-checkbox">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: '#2563a6'
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
                    background: '#2f7f83'
                  }}
                ></span>
                Overhead Water Tanks
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
                    background: '#16324f'
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
                    background: '#dc2626'
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
                    background: '#dc2626',
                    border: '1px dashed #ffffff'
                  }}
                ></span>
                Defect Polyline Highlight
              </span>
              <input
                type="checkbox"
                checked={mapFilters.defectHighlight}
                onChange={() => toggleMapFilter('defectHighlight')}
              />
            </label>
          </div>
        </div>

        {/* Pin Dropper Action */}
        <div className="card" style={{ padding: '16px', background: '#eaf3f8', borderColor: '#cbd5e1' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: '#16324f',
              marginBottom: '6px'
            }}
          >
            <Crosshair size={18} color="#2563a6" />
            <span>Map Pin Selector</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#667784', marginBottom: '12px' }}>
            {isPinPickerActive
              ? 'Click anywhere on the map to set complaint location coordinates.'
              : 'Pick location coordinates directly on the GIS map to auto-fill the complaint form.'}
          </p>
          <button
            className={isPinPickerActive ? 'btn-secondary' : 'btn-primary'}
            style={{ width: '100%', fontSize: '0.85rem' }}
            onClick={() => setIsPinPickerActive(!isPinPickerActive)}
          >
            {isPinPickerActive ? 'Cancel Pin Dropper' : 'Drop Pin for New Issue'}
          </button>
        </div>

        {/* Selected Complaint Details */}
        {selectedComplaint ? (
          <div className="card" style={{ padding: '16px', borderColor: '#2563a6' }}>
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
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, marginTop: '4px', color: '#16324f' }}>
                  {selectedComplaint.type}
                </h4>
              </div>
              <span
                className={'badge badge-' + (selectedComplaint.priority ? selectedComplaint.priority.toLowerCase() : 'medium')}
              >
                {selectedComplaint.priority} Priority
              </span>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#1f2933', marginBottom: '10px' }}>
              {selectedComplaint.description}
            </p>

            <div
              style={{
                fontSize: '0.8rem',
                color: '#667784',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                marginBottom: '12px'
              }}
            >
              <div>
                <strong>Affected Pipeline:</strong>{' '}
                <span style={{ color: '#2563a6', fontWeight: 600 }}>{selectedComplaint.pipelineName}</span>
              </div>
              <div>
                <strong>Status:</strong>{' '}
                <span style={{ textTransform: 'capitalize', color: '#1f2933', fontWeight: 600 }}>
                  {selectedComplaint.status}
                </span>
              </div>
              <div>
                <strong>Assigned Team:</strong>{' '}
                {officers.find((o) => o.id === selectedComplaint.assignedOfficerId)?.name ||
                  'Eng. Rajesh Kumar'}
              </div>
            </div>

            {selectedComplaint.aiRecommendation && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #d9e2e8',
                  borderRadius: '6px',
                  padding: '10px',
                  fontSize: '0.78rem',
                  marginBottom: '12px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#16324f',
                    fontWeight: 700,
                    marginBottom: '4px'
                  }}
                >
                  <Activity size={14} color="#2563a6" /> Operational Diagnostics
                </div>
                <div style={{ color: '#334155' }}>{selectedComplaint.aiRecommendation}</div>
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
                    color: '#15803d',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  ✓ Issue Resolved
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
              color: '#667784',
              fontSize: '0.85rem'
            }}
          >
            Click any marker or polyline on the map to view operational attributes.
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
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | AquaMap Municipal GIS'
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
                    color: isAffected ? '#dc2626' : '#2563a6',
                    weight: isAffected ? 6 : 4,
                    dashArray: isAffected ? '8, 8' : null,
                    opacity: isAffected ? 0.95 : 0.8,
                    className: isAffected ? 'pulsing-defect-line' : ''
                  }}
                >
                  <Popup>
                    <div style={{ padding: '4px', minWidth: '180px' }}>
                      <h4 style={{ color: '#16324f', fontWeight: 800 }}>{pipe.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0' }}>
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
                          <strong>Pressure:</strong> {pipe.pressure}
                        </div>
                        {isAffected && (
                          <div
                            style={{
                              color: '#b91c1c',
                              fontWeight: 700,
                              marginTop: '4px',
                              background: '#fee2e2',
                              padding: '4px 6px',
                              borderRadius: '4px'
                            }}
                          >
                            ⚠️ Active Defect Segment Highlighted
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
                        background: isPump ? '#16324f' : '#2f7f83',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      {item.type}
                    </span>
                    <h4 style={{ color: '#16324f', fontWeight: 800, marginTop: '4px' }}>
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
                        <strong>Current Level:</strong> {item.currentLevel}
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
                          background: cmp.status === 'Resolved' ? '#16a34a' : '#dc2626',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        {cmp.id} - {cmp.priority} Priority
                      </span>
                      <h4 style={{ color: '#16324f', fontWeight: 800, marginTop: '4px' }}>
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
                          background: '#2563a6',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.78rem'
                        }}
                        onClick={() => setSelectedComplaint(cmp)}
                      >
                        Select Affected Pipeline
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
