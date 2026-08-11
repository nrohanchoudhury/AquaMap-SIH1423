import React, { useState } from 'react';
import { useAqua } from '../context/AquaContext';
import { calculateHotspots } from '../utils/geoUtils';
import {
  Search,
  Flame,
  MapPin,
  Eye,
  Activity,
  X
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
    <div style={{ maxWidth: '1200px', margin: '28px auto', padding: '0 20px' }}>
      {/* Hotspot Alert Banner */}
      {hotspotPipeline && activeComplaintCount > 0 && (
        <div className="hotspot-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#dc2626'
              }}
            >
              <Flame size={22} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#dc2626',
                  letterSpacing: '0.5px'
                }}
              >
                Hotspot Advisory
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b' }}>
                High Issue Density on "{hotspotPipeline.name}" ({hotspotPipeline.zone})
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#7f1d1d' }}>
                {activeComplaintCount} active complaints logged along this pipeline segment. Field inspection advised.
              </p>
            </div>
          </div>
          <button
            className="btn-primary"
            style={{
              background: '#dc2626',
              boxShadow: 'none'
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
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={18}
              color="#94a3b8"
              style={{ position: 'absolute', left: 14, top: 11 }}
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
            style={{ width: '150px' }}
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
            style={{ width: '150px' }}
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
              <th>ID & Priority</th>
              <th>Issue Details</th>
              <th>Affected Pipeline</th>
              <th>Assigned Team</th>
              <th>Timestamp</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#667784' }}>
                  No complaints match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredComplaints.map((cmp) => {
                const assignedOfficer = officers.find((o) => o.id === cmp.assignedOfficerId);
                return (
                  <tr key={cmp.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#16324f' }}>
                        {cmp.id}
                      </div>
                      <span className={'badge badge-' + (cmp.priority ? cmp.priority.toLowerCase() : 'medium')}>
                        {cmp.priority}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#1f2933' }}>{cmp.type}</div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#667784',
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
                      <div style={{ color: '#2563a6', fontWeight: 600 }}>{cmp.pipelineName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {cmp.pipelineId}</div>
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
                    <td style={{ fontSize: '0.8rem', color: '#667784' }}>
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
                          style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                          title="Focus on Map"
                          onClick={() => focusComplaintOnMap(cmp)}
                        >
                          <MapPin size={14} color="#2563a6" /> Map
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                          title="View Operational Diagnostics"
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
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
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
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16324f', marginTop: '4px' }}>
                  {selectedDetail.type} Report Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667784',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#1f2933', marginBottom: '16px', fontSize: '0.9rem' }}>
              {selectedDetail.description}
            </p>

            <div
              style={{
                background: '#eaf3f8',
                border: '1px solid #cbd5e1',
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
                  color: '#16324f',
                  fontWeight: 700,
                  marginBottom: '6px'
                }}
              >
                <Activity size={16} color="#2563a6" /> Operational Issue Classification
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#475569',
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
                <div style={{ marginTop: '4px', color: '#1e293b' }}>
                  <strong>Recommended Field Action:</strong> {selectedDetail.aiRecommendation}
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
                <MapPin size={15} /> Locate on Map
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
