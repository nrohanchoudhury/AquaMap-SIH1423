import React from 'react';
import { useAqua } from '../context/AquaContext';
import { Users, Phone, Mail, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export const OfficerDashboard = () => {
  const { officers, complaints, updateComplaintStatus, focusComplaintOnMap } = useAqua();

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Field Engineering Officer Dashboard</h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
          Monitor municipal engineer workloads, zone assignments, and active task queues.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px'
        }}
      >
        {officers.map((officer) => {
          const assignedComplaints = complaints.filter(
            (c) => c.assignedOfficerId === officer.id
          );
          const activeTasks = assignedComplaints.filter((c) => c.status !== 'Resolved');
          const resolvedCount = assignedComplaints.filter((c) => c.status === 'Resolved').length;

          return (
            <div key={officer.id} className="card" style={{ padding: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{officer.name}</h3>
                  <div style={{ fontSize: '0.82rem', color: '#06b6d4', fontWeight: 600 }}>
                    {officer.designation}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                    Zone: {officer.zone}
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(6, 182, 212, 0.12)',
                    color: '#06b6d4',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(6, 182, 212, 0.3)'
                  }}
                >
                  ID: {officer.id}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  fontSize: '0.8rem',
                  color: '#64748b',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} /> {officer.phone}
                </div>
              </div>

              {/* Task Stat Pills */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '20px'
                }}
              >
                <div
                  style={{
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f43f5e' }}>
                    {activeTasks.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#fda4af' }}>Active Queue</div>
                </div>

                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                    {officer.completedTasks + resolvedCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>Resolved Issues</div>
                </div>
              </div>

              {/* Assigned Task Queue list */}
              <h4
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                  letterSpacing: '0.5px',
                  marginBottom: '10px'
                }}
              >
                Assigned Issue Queue ({assignedComplaints.length})
              </h4>

              {assignedComplaints.length === 0 ? (
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: '#64748b',
                    textAlign: 'center',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px'
                  }}
                >
                  No active tasks assigned to this officer.
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    maxHeight: '280px',
                    overflowY: 'auto'
                  }}
                >
                  {assignedComplaints.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '12px'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{task.type}</span>
                        <span
                          className={'badge badge-' + (task.priority ? task.priority.toLowerCase() : 'medium')}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px' }}>
                        Line: <strong style={{ color: '#06b6d4' }}>{task.pipelineName}</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => focusComplaintOnMap(task)}
                        >
                          Locate on Map
                        </button>
                        {task.status !== 'Resolved' && (
                          <button
                            className="btn-primary"
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              background: '#10b981'
                            }}
                            onClick={() => updateComplaintStatus(task.id, 'Resolved')}
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
