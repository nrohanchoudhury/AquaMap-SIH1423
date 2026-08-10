import React from 'react';
import { useAqua } from '../context/AquaContext';
import {
  BarChart3,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Droplet,
  Layers,
  Clock,
  TrendingUp
} from 'lucide-react';

export const Analytics = () => {
  const { pipelines, complaints, officers } = useAqua();

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
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
          Municipal Water Network Analytics & Insights
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
          Real-time GIS statistics, resolution performance metrics, and pipeline vulnerability metrics.
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
        <div className="card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#06b6d4',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>
              Mapped Pipeline Lines
            </span>
            <Layers size={22} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{pipelines.length} Lines</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            ~14.2 km Total Network Span
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#f43f5e',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>
              Active Unresolved Issues
            </span>
            <AlertTriangle size={22} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f43f5e' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#fda4af', marginTop: '4px' }}>
            {highPriorityCount} High / Critical Priority
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#10b981',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>
              Resolution Efficiency
            </span>
            <ShieldCheck size={22} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>
            {resolutionRate}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: '4px' }}>
            {resolvedCount} of {totalComplaints} Resolved
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#3b82f6',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>
              Average SLA Time
            </span>
            <Clock size={22} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>4.2 Hrs</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            Emergency SLA: 2.0 Hrs Target
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Category Breakdown Bar Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart3 size={20} color="#06b6d4" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              Issue Category Distribution
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
              return (
                <div key={cat}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      marginBottom: '6px'
                    }}
                  >
                    <span>{cat}</span>
                    <span style={{ color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '10px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      borderRadius: '5px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background:
                          cat === 'Leakage'
                            ? 'linear-gradient(90deg, #f43f5e, #fb923c)'
                            : cat === 'No Supply'
                            ? 'linear-gradient(90deg, #f59e0b, #facc15)'
                            : 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                        borderRadius: '5px',
                        transition: 'width 0.6s ease'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline Defect Vulnerability Ratings */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Activity size={20} color="#f43f5e" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              Pipeline Vulnerability Index
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pipelines.map((pipe) => {
              const pipeComplaints = complaints.filter((c) => c.pipelineId === pipe.id);
              const activeCountOnPipe = pipeComplaints.filter((c) => c.status !== 'Resolved').length;

              let riskLevel = 'Low Risk';
              let riskColor = '#10b981';
              if (activeCountOnPipe >= 2) {
                riskLevel = 'Critical Risk';
                riskColor = '#f43f5e';
              } else if (activeCountOnPipe === 1) {
                riskLevel = 'Moderate Risk';
                riskColor = '#f59e0b';
              }

              return (
                <div
                  key={pipe.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{pipe.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Material: {pipe.material} | Spec: {pipe.diameter}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: `${riskColor}22`,
                        color: riskColor,
                        border: `1px solid ${riskColor}55`
                      }}
                    >
                      {riskLevel}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
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
