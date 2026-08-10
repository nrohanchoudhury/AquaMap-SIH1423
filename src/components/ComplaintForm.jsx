import React, { useState, useEffect } from 'react';
import { useAqua } from '../context/AquaContext';
import { classifyWaterIssue } from '../utils/aiClassifier';
import { findNearestPipeline } from '../utils/geoUtils';
import confetti from 'canvas-confetti';
import {
  Send,
  MapPin,
  Compass,
  Cpu,
  AlertOctagon,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export const ComplaintForm = () => {
  const {
    pipelines,
    addNewComplaint,
    selectedLocationForForm,
    setSelectedLocationForForm,
    setIsPinPickerActive,
    setActiveTab,
    addToast
  } = useAqua();

  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [type, setType] = useState('Leakage');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('22.3060');
  const [lng, setLng] = useState('73.1880');
  const [isLocating, setIsLocating] = useState(false);

  // Sync coordinates if set via map pin dropper
  useEffect(() => {
    if (selectedLocationForForm) {
      setLat(selectedLocationForForm.lat.toString());
      setLng(selectedLocationForForm.lng.toString());
    }
  }, [selectedLocationForForm]);

  // Live Rule-based AI Engine Preview
  const aiPreview = classifyWaterIssue(type, description);

  // Live Spatial Nearest Pipe calculation
  const nearestPipePreview = findNearestPipeline(
    parseFloat(lat) || 22.306,
    parseFloat(lng) || 73.188,
    pipelines
  );

  // Browser Geolocation Handler
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      addToast('GPS Error', 'Geolocation is not supported by your browser.', 'info');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude.toFixed(6);
        const longitude = pos.coords.longitude.toFixed(6);
        setLat(latitude);
        setLng(longitude);
        setSelectedLocationForForm({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
        setIsLocating(false);
        addToast('GPS Acquired', `Location set to [${latitude}, ${longitude}].`, 'success');
      },
      (err) => {
        setIsLocating(false);
        addToast(
          'GPS Location Failed',
          'Could not retrieve GPS coordinates. Defaulting to municipal center.',
          'info'
        );
      },
      { timeout: 10000 }
    );
  };

  const handleOpenMapPinPicker = () => {
    setIsPinPickerActive(true);
    setActiveTab('map');
    addToast('Pin Dropper Active', 'Click anywhere on the GIS map to drop a pin.', 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type || !lat || !lng) {
      addToast('Validation Error', 'Please select issue type and location coordinates.', 'info');
      return;
    }

    addNewComplaint({
      reporterName,
      reporterPhone,
      type,
      description,
      lat,
      lng
    });

    // Trigger celebratory confetti effect for civic participation!
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="form-container">
      <div className="card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#06b6d4'
            }}
          >
            <FileSpreadsheet size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Citizen Water Complaint Report</h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
              Log a municipal water network issue with precise GIS positioning & automated AI classification.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Citizen / Reporter Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ramesh Patel"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Contact Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98765 00000"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Issue Type *</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="Leakage">Pipeline Leakage / Burst</option>
              <option value="No Water">No Water Supply / Complete Outage</option>
              <option value="Low Pressure">Low Water Pressure</option>
              <option value="Water Quality">Contaminated / Discolored Water</option>
              <option value="Other">Other Infrastructure Issue</option>
            </select>
          </div>

          <div className="form-group">
            <label>Detailed Problem Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe symptoms (e.g., heavy water gushing from main line joint, dirty water smell, dry taps since morning)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Real-time AI Rule Engine Preview */}
          <div className="ai-preview-box">
            <div className="ai-header">
              <Cpu size={18} />
              <span>Real-Time AI Rule Classifier & Priority Engine</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                Confidence: {aiPreview.confidence}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              <span className={'badge badge-' + (aiPreview.priority ? aiPreview.priority.toLowerCase() : 'medium')}>
                Predicted Urgency: {aiPreview.priority}
              </span>
              <span className="badge badge-assigned">Category: {aiPreview.category}</span>
              <span
                style={{
                  fontSize: '0.78rem',
                  color: '#cbd5e1',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}
              >
                Target SLA: {aiPreview.estimatedSLA}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#99f6e4' }}>
              <strong>Recommended Action:</strong> {aiPreview.recommendation}
            </div>
          </div>

          {/* Geolocation & Map Pin Picker Section */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '24px'
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '12px'
              }}
            >
              <MapPin size={18} color="#06b6d4" />
              <span>GIS Geolocation Coordinates *</span>
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '12px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Latitude</span>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                />
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Longitude</span>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.82rem' }}
                onClick={handleUseGPS}
                disabled={isLocating}
              >
                <Compass size={16} />
                {isLocating ? 'Acquiring GPS...' : 'Use Current Device GPS'}
              </button>

              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.82rem', borderColor: 'var(--primary-aqua)' }}
                onClick={handleOpenMapPinPicker}
              >
                <MapPin size={16} color="#06b6d4" />
                Select Location on Map Pin
              </button>
            </div>

            {nearestPipePreview && (
              <div
                style={{
                  marginTop: '12px',
                  fontSize: '0.8rem',
                  color: '#38bdf8',
                  background: 'rgba(6, 182, 212, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={14} />
                <span>
                  Nearest Pipeline Identified:{' '}
                  <strong>{nearestPipePreview.name}</strong> ({nearestPipePreview.distanceMeters}m away)
                </span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
            <Send size={18} />
            Submit Complaint to Municipal Network
          </button>
        </form>
      </div>
    </div>
  );
};
