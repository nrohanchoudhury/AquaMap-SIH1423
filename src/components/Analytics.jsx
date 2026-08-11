import React from 'react';
import { useAqua } from '../context/AquaContext';
import {
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Layers,
  Clock
} from 'lucide-react';

export const Analytics = () => {
  const { pipelines, complaints } = useAqua();

  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const activeCount = totalComplaints - resolvedCount;
  const highPriorityCount = complaints.filter(
    (c) => c.priority === 'High' || c.priority === 'Critical'
  ).length;

  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 100;

  // Category counts
  const categoryCounts = {
    Leakage: complaints.filter((c) => c.category === 'Leakage').length,
    'No Supply': complaints.filter((c) => c.category === 'No Supply').length,
    'Low Pressure': complaints.filter((c) => c.category === 'Low Pressure').length,
    'Water Quality': complaints.filter((c) => c.category === 'Water Quality').length,
    Other: complaints.filter((c) => c.category === 'Other').length
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '28px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16324f' }}>
          Municipal Water Network Analytics & Insights
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#667784' }}>
          Operational GIS metrics, category breakdowns, resolution SLA efficiency, and pipeline vulnerability indices.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="card" style={{ padding: '18px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#2563a6',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#667784' }}>
              Network Pipelines Span
            </span>
            <Layers size={20} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16324f' }}>
            {pipelines.length} Lines
          </div>
          <div style={{ fontSize: '0.78rem', color: '#667784', marginTop: '2px' }}>
            ~14.2 km Total Network Span
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#dc2626',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#667784' }}>
              Active Unresolved Issues
            </span>
            <AlertTriangle size={20} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#991b1b', marginTop: '2px' }}>
            {highPriorityCount} High / Critical Priority
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#16a34a',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#667784' }}>
              Resolution SLA Rate
            </span>
            <ShieldCheck size={20} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a' }}>
            {resolutionRate}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#166534', marginTop: '2px' }}>
            {resolvedCount} of {totalComplaints} Issues Resolved
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#2563a6',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#667784' }}>
              Average Response Time
            </span>
            <Clock size={20} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16324f' }}>
            4.2 Hours
          </div>
          <div style={{ fontSize: '0.78rem', color: '#667784', marginTop: '2px' }}>
            Emergency SLA: 2.0 Hours Target
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Category Breakdown */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <BarChart3 size={18} color="#2563a6" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16324f' }}>
              Complaint Category Distribution
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
              return (
                <div key={cat}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#1f2933',
                      marginBottom: '4px'
                    }}
                  >
                    <span>{cat}</span>
                    <span style={{ color: '#2563a6', fontFamily: 'var(--font-mono)' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: '#f1f5f9',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background:
                          cat === 'Leakage'
                            ? '#dc2626'
                            : cat === 'No Supply'
                            ? '#d97706'
                            : '#2563a6',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline Defect Vulnerability Ratings */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Activity size={18} color="#dc2626" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16324f' }}>
              Pipeline Vulnerability Ratings
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pipelines.map((pipe) => {
              const pipeComplaints = complaints.filter((c) => c.pipelineId === pipe.id);
              const activeCountOnPipe = pipeComplaints.filter((c) => c.status !== 'Resolved').length;

              let riskLevel = 'Low Risk';
              let riskClass = 'badge-normal';
              if (activeCountOnPipe >= 2) {
                riskLevel = 'High Vulnerability';
                riskClass = 'badge-critical';
              } else if (activeCountOnPipe === 1) {
                riskLevel = 'Moderate Risk';
                riskClass = 'badge-medium';
              }

              return (
                <div
                  key={pipe.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1f2933' }}>
                      {pipe.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#667784' }}>
                      Material: {pipe.material} | Spec: {pipe.diameter}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className={'badge ' + riskClass}>
                      {riskLevel}
                    </span>
                    <div style={{ fontSize: '0.74rem', color: '#667784', marginTop: '2px' }}>
                      {activeCountOnPipe} active issues
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
