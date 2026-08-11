import React from 'react';
import { useAqua } from '../context/AquaContext';
import { Phone } from 'lucide-react';

export const OfficerDashboard = () => {
  const { officers, complaints, updateComplaintStatus, focusComplaintOnMap } = useAqua();

  return (
    <div style={{ maxWidth: '1200px', margin: '28px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16324f' }}>
          Field Engineering & Response Teams
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#667784' }}>
          Overview of municipal engineer workload queues, zone assignments, and active task status.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
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
            <div key={officer.id} className="card" style={{ padding: '22px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16324f' }}>
                    {officer.name}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#2563a6', fontWeight: 600 }}>
                    {officer.designation}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#667784', marginTop: '2px' }}>
                    Zone: {officer.zone}
                  </div>
                </div>
                <div
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '3px 9px',
                    borderRadius: '9999px',
                    border: '1px solid #7dd3fc'
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
                  color: '#667784',
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
                  marginBottom: '18px'
                }}
              >
                <div
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>
                    {activeTasks.length}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#991b1b', fontWeight: 600 }}>
                    Active Queue
                  </div>
                </div>

                <div
                  style={{
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>
                    {officer.completedTasks + resolvedCount}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 600 }}>
                    Resolved Issues
                  </div>
                </div>
              </div>

              {/* Assigned Task Queue */}
              <h4
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#667784',
                  letterSpacing: '0.4px',
                  marginBottom: '10px'
                }}
              >
                Assigned Work Queue ({assignedComplaints.length})
              </h4>

              {assignedComplaints.length === 0 ? (
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: '#667784',
                    textAlign: 'center',
                    padding: '14px',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  No active tasks assigned to this team.
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
                        background: '#f8fafc',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '10px 12px'
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
                        <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1f2933' }}>
                          {task.type}
                        </span>
                        <span
                          className={'badge badge-' + (task.priority ? task.priority.toLowerCase() : 'medium')}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#667784', marginBottom: '8px' }}>
                        Line: <strong style={{ color: '#2563a6' }}>{task.pipelineName}</strong>
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
                              background: '#16a34a'
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
