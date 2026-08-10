import React, { useState } from 'react';
import { useAqua } from '../context/AquaContext';
import { calculateHotspots } from '../utils/geoUtils';
import {
  Search,
  Filter,
  Flame,
  MapPin,
  CheckCircle,
  UserCheck,
  Eye,
  AlertTriangle,
  Cpu
} from 'lucide-react';

export const ComplaintList = () => {
  const {
    complaints,
    pipelines,
    officers,
    updateComplaintStatus,
    reassignOfficer,
    focusComplaintOnMap
  } = useAqua();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Calculate Defect Hotspot
  const { hotspotPipeline, activeComplaintCount } = calculateHotspots(complaints, pipelines);

  // Filter complaints
  const filteredComplaints = complaints.filter((cmp) => {
    const matchesSearch =
      cmp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmp.pipelineName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || cmp.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || cmp.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      {/* Hotspot Alert Banner */}
      {hotspotPipeline && activeComplaintCount > 0 && (
        <div className="hotspot-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                padding: '10px',
                borderRadius: '12px',
                background: 'rgba(244, 63, 94, 0.2)',
                color: '#f43f5e'
              }}
            >
              <Flame size={24} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#f43f5e',
                  letterSpacing: '0.5px'
                }}
              >
                Municipal Pipeline Hotspot Detected
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                High Complaint Density on "{hotspotPipeline.name}" ({hotspotPipeline.zone})
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                {activeComplaintCount} active issues detected along this line segment. Dispatch field pressure audit crew.
              </p>
            </div>
          </div>
          <button
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              boxShadow: '0 4px 14px rgba(244, 63, 94, 0.4)'
            }}
            onClick={() =>
              focusComplaintOnMap(
                complaints.find((c) => c.pipelineId === hotspotPipeline.id) || complaints[0]
              )
            }
          >
            Inspect Hotspot on Map
          </button>
        </div>
      )}

      {/* Control Header & Filters */}
      <div
        className="card"
        style={{
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={18}
              color="#64748b"
              style={{ position: 'absolute', left: 14, top: 12 }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by ID, type, pipeline name, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: '160px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="form-select"
            style={{ width: '160px' }}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Complaint Log Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID & Urgency</th>
              <th>Issue Type & Details</th>
              <th>Affected Pipeline</th>
              <th>Assigned Officer</th>
              <th>Timestamp</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No complaints match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredComplaints.map((cmp) => {
                const assignedOfficer = officers.find((o) => o.id === cmp.assignedOfficerId);
                return (
                  <tr key={cmp.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{cmp.id}</div>
                      <span className={'badge badge-' + (cmp.priority ? cmp.priority.toLowerCase() : 'medium')}>
                        {cmp.priority}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#f8fafc' }}>{cmp.type}</div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#94a3b8',
                          maxWidth: '260px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {cmp.description}
                      </div>
                    </td>
                    <td>
                      <div style={{ color: '#06b6d4', fontWeight: 600 }}>{cmp.pipelineName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {cmp.pipelineId}</div>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.8rem', width: '150px' }}
                        value={cmp.assignedOfficerId}
                        onChange={(e) => reassignOfficer(cmp.id, e.target.value)}
                      >
                        {officers.map((off) => (
                          <option key={off.id} value={off.id}>
                            {off.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {new Date(cmp.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.8rem', width: '130px' }}
                        value={cmp.status}
                        onChange={(e) => updateComplaintStatus(cmp.id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          title="Focus on Map"
                          onClick={() => focusComplaintOnMap(cmp)}
                        >
                          <MapPin size={14} color="#06b6d4" /> Map
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          title="View Full AI Analysis"
                          onClick={() => setSelectedDetail(cmp)}
                        >
                          <Eye size={14} /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="card"
            style={{ maxWidth: '600px', width: '100%', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}
            >
              <div>
                <span className="badge badge-critical">{selectedDetail.id}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px' }}>
                  {selectedDetail.type} Report
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>{selectedDetail.description}</p>

            <div
              style={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '16px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#06b6d4',
                  fontWeight: 700,
                  marginBottom: '6px'
                }}
              >
                <Cpu size={18} /> Rule-Based AI Engine Diagnostics
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div>
                  <strong>Category:</strong> {selectedDetail.category}
                </div>
                <div>
                  <strong>Urgency Priority:</strong> {selectedDetail.priority}
                </div>
                <div>
                  <strong>Confidence:</strong> {selectedDetail.aiConfidence || '95%'}
                </div>
                <div>
                  <strong>Target SLA:</strong> {selectedDetail.estimatedSLA || '12 Hours'}
                </div>
                <div style={{ marginTop: '4px', color: '#99f6e4' }}>
                  <strong>Operational Recommendation:</strong> {selectedDetail.aiRecommendation}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  focusComplaintOnMap(selectedDetail);
                  setSelectedDetail(null);
                }}
              >
                <MapPin size={16} /> Focus on Map
              </button>
              <button className="btn-secondary" onClick={() => setSelectedDetail(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
