import React, { createContext, useContext, useState, useEffect } from 'react';
import initialPipelines from '../data/pipelines.json';
import initialTanks from '../data/tanks.json';
import initialOfficers from '../data/officers.json';
import initialComplaints from '../data/complaints.json';
import { findNearestPipeline } from '../utils/geoUtils';
import { classifyWaterIssue } from '../utils/aiClassifier';

const AquaContext = createContext();

export const AquaProvider = ({ children }) => {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState('map');

  // Map Filter state
  const [mapFilters, setMapFilters] = useState({
    pipelines: true,
    tanks: true,
    pumps: true,
    complaints: true,
    defectHighlight: true
  });

  // Main data states with LocalStorage persistence
  const [pipelines, setPipelines] = useState(() => {
    const saved = localStorage.getItem('aquamap_pipelines');
    return saved ? JSON.parse(saved) : initialPipelines;
  });

  const [tanks, setTanks] = useState(() => {
    const saved = localStorage.getItem('aquamap_tanks');
    return saved ? JSON.parse(saved) : initialTanks;
  });

  const [officers, setOfficers] = useState(() => {
    const saved = localStorage.getItem('aquamap_officers');
    return saved ? JSON.parse(saved) : initialOfficers;
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('aquamap_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  // Selected complaint for highlighting on map & detail modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Pin picker state for interactive complaint location submission
  const [isPinPickerActive, setIsPinPickerActive] = useState(false);
  const [selectedLocationForForm, setSelectedLocationForForm] = useState(null);

  // Toast Alerts
  const [toasts, setToasts] = useState([]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('aquamap_pipelines', JSON.stringify(pipelines));
  }, [pipelines]);

  useEffect(() => {
    localStorage.setItem('aquamap_tanks', JSON.stringify(tanks));
  }, [tanks]);

  useEffect(() => {
    localStorage.setItem('aquamap_officers', JSON.stringify(officers));
  }, [officers]);

  useEffect(() => {
    localStorage.setItem('aquamap_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Toast Notification helper
  const addToast = (title, message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle map layer filter
  const toggleMapFilter = (key) => {
    setMapFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Add new complaint (with spatial pipe detection & AI classification)
  const addNewComplaint = (formData) => {
    const { reporterName, reporterPhone, type, description, lat, lng } = formData;

    // Run spatial analysis for nearest pipeline
    const nearestPipe = findNearestPipeline(parseFloat(lat), parseFloat(lng), pipelines);

    // Run AI Classifier
    const aiAnalysis = classifyWaterIssue(type, description);

    // Round-robin or workload-balanced officer assignment (Defaulting to Officer #1 or lowest load)
    const assignedOfficer = officers[0] || { id: 'OFF-101', name: 'Eng. Rajesh Kumar' };

    const newId = `CMP-2026-${String(complaints.length + 1).padStart(3, '0')}`;

    const newComplaint = {
      id: newId,
      reporterName: reporterName || 'Anonymous Citizen',
      reporterPhone: reporterPhone || '+91 90000 00000',
      type,
      description,
      timestamp: new Date().toISOString(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      status: 'Assigned',
      assignedOfficerId: assignedOfficer.id,
      pipelineId: nearestPipe ? nearestPipe.id : 'P-101',
      pipelineName: nearestPipe ? nearestPipe.name : 'Main Line Alpha (Trunk)',
      category: aiAnalysis.category,
      priority: aiAnalysis.priority,
      aiConfidence: aiAnalysis.confidence,
      aiRecommendation: aiAnalysis.recommendation,
      estimatedSLA: aiAnalysis.estimatedSLA
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    setSelectedComplaint(newComplaint);

    addToast(
      'Complaint Logged Successfully',
      `Issue ${newId} mapped to pipeline "${newComplaint.pipelineName}". Auto-assigned to ${assignedOfficer.name}.`,
      'success'
    );

    // Switch to Map tab with defect highlighted
    setActiveTab('map');
    return newComplaint;
  };

  // Update complaint status (New -> Assigned -> In Progress -> Resolved)
  const updateComplaintStatus = (complaintId, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
    );

    const cmp = complaints.find((c) => c.id === complaintId);
    addToast(
      'Status Updated',
      `Complaint ${complaintId} marked as "${newStatus}".`,
      newStatus === 'Resolved' ? 'success' : 'info'
    );

    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Reassign officer to complaint
  const reassignOfficer = (complaintId, officerId) => {
    const officer = officers.find((o) => o.id === officerId);
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, assignedOfficerId: officerId } : c))
    );

    addToast(
      'Officer Reassigned',
      `Complaint ${complaintId} assigned to ${officer ? officer.name : officerId}.`,
      'info'
    );
  };

  // Focus complaint on Map
  const focusComplaintOnMap = (complaint) => {
    setSelectedComplaint(complaint);
    setActiveTab('map');
  };

  // Reset to initial mock data
  const resetToDefaultData = () => {
    setPipelines(initialPipelines);
    setTanks(initialTanks);
    setOfficers(initialOfficers);
    setComplaints(initialComplaints);
    localStorage.clear();
    addToast('Data Reset', 'All data restored to factory GIS mock defaults.', 'info');
  };

  return (
    <AquaContext.Provider
      value={{
        activeTab,
        setActiveTab,
        mapFilters,
        toggleMapFilter,
        pipelines,
        tanks,
        officers,
        complaints,
        selectedComplaint,
        setSelectedComplaint,
        isPinPickerActive,
        setIsPinPickerActive,
        selectedLocationForForm,
        setSelectedLocationForForm,
        addNewComplaint,
        updateComplaintStatus,
        reassignOfficer,
        focusComplaintOnMap,
        resetToDefaultData,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AquaContext.Provider>
  );
};

export const useAqua = () => useContext(AquaContext);
