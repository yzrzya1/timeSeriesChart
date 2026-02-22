import React, { useState, useRef, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { generateTimeSeriesData } from './mockData';
import { BarChart, LineChart } from './components/charts';
import { useSize } from './hooks/useSize';

// ── Theme ─────────────────────────────────────────────────────────────────────
const T = {
  bg:     '#111217',
  panel:  '#1b1c21',
  border: 'rgba(255,255,255,0.08)',
  text:   '#d9d9d9',
  muted:  '#8e8e8e',
  green:  '#73bf69',
  red:    '#f2495c',
  blue:   '#5794f2',
  yellow: '#fade2a',
  orange: '#e0752d',
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const fmt = (label: string) => {
  const d = new Date(label);
  if (isNaN(d.getTime())) return label;
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:00`;
};

const pageLoadsData = generateTimeSeriesData(48, 18, 25, 30).map(p => ({ label: fmt(p.label), value: Math.round(p.value) }));
const jsErrorsData  = generateTimeSeriesData(48,  4,  6, 30).map(p => ({ label: fmt(p.label), value: Math.round(p.value) }));

const pageLoadSeries = [
  { key: 'TTFB', color: T.blue,   data: generateTimeSeriesData(30, 0.5, 0.3, 240).map(p => ({ label: fmt(p.label), value: +p.value.toFixed(2) })) },
  { key: 'FCP',  color: T.yellow, data: generateTimeSeriesData(30, 2.0, 1.5, 240).map(p => ({ label: fmt(p.label), value: +p.value.toFixed(2) })) },
  { key: 'LCP',  color: '#ccc',   data: generateTimeSeriesData(30, 4.0, 2.0, 240).map(p => ({ label: fmt(p.label), value: +p.value.toFixed(2) })) },
];
const clsSeries = [{ key: 'CLS', color: T.green, data: generateTimeSeriesData(30, 0.15, 0.1, 240).map(p => ({ label: fmt(p.label), value: +p.value.toFixed(3) })) }];
const fidSeries = [{ key: 'FID', color: T.green, data: generateTimeSeriesData(30, 10, 8, 240).map(p => ({ label: fmt(p.label), value: +p.value.toFixed(1) })) }];

// ── Stat Panel ────────────────────────────────────────────────────────────────
interface StatPanelProps { label: string; value: string; color: string }
const StatPanel: React.FC<StatPanelProps> = ({ label, value, color }) => (
  <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 4, padding: '12px 16px', flex: 1, minWidth: 0 }}>
    <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>{label} <span style={{ opacity: 0.5 }}>ⓘ</span></div>
    <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1.2 }}>{value}</div>
  </div>
);

// ── Chart Panel ───────────────────────────────────────────────────────────────
interface PanelProps { title: string; children: ReactNode; showExplore?: boolean }
const Panel: React.FC<PanelProps> = ({ title, children, showExplore }) => (
  <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 4, padding: '12px 16px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{title}</span>
      {showExplore && (
        <button style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.muted, padding: '2px 8px', fontSize: 11, borderRadius: 3, cursor: 'pointer' }}>⊕ Explore</button>
      )}
    </div>
    <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
  </div>
);

// ── App ───────────────────────────────────────────────────────────────────────
const TABS = ['Overview', 'Errors', 'Sessions', 'Settings', 'Web SDK Configuration'];

const DEFAULT_LAYOUT = [
  { x: 0, y: 0, w: 6, h: 4, i: 'page-loads' },
  { x: 6, y: 0, w: 6, h: 4, i: 'js-errors' },
  { x: 0, y: 4, w: 4, h: 5, i: 'page-load-p75' },
  { x: 4, y: 4, w: 4, h: 5, i: 'cls-p75' },
  { x: 8, y: 4, w: 4, h: 5, i: 'fid-p75' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const containerRef = useRef<HTMLDivElement>(null);
  const { w: gridWidth } = useSize(containerRef as React.RefObject<HTMLElement>);

  const [layout, setLayout] = useState(() => {
    try { return JSON.parse(localStorage.getItem('grafana-layout') ?? '') || DEFAULT_LAYOUT; }
    catch { return DEFAULT_LAYOUT; }
  });

  const chartTheme = { panelBg: T.panel };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* Header */}
      <div style={{ background: T.panel, borderBottom: `1px solid ${T.border}`, padding: '0 16px', display: 'flex', alignItems: 'center', height: 48 }}>
        <span style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>grafana-oncall-ops</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Filters +', '⊙ Last 7 days ∨'].map(lbl => (
            <button key={lbl} style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.text, padding: '4px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 12 }}>{lbl}</button>
          ))}
          <button style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.text, padding: '4px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 14 }}>⟳</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: T.panel, borderBottom: `1px solid ${T.border}`, padding: '0 16px', display: 'flex' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: 'transparent', border: 'none',
            borderBottom: activeTab === tab ? `2px solid ${T.orange}` : '2px solid transparent',
            color: activeTab === tab ? T.text : T.muted,
            padding: '10px 16px', fontSize: 13, cursor: 'pointer',
            fontWeight: activeTab === tab ? 500 : 400,
          }}>{tab}</button>
        ))}
      </div>

      {/* Content */}
      <div ref={containerRef} style={{ padding: 16 }}>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <StatPanel label="TTFB"       value="506 ms"    color={T.green} />
          <StatPanel label="FCP"        value="2.26 min"  color={T.red}   />
          <StatPanel label="CLS"        value="0.0945 ms" color={T.green} />
          <StatPanel label="LCP"        value="3.88 s"    color={T.green} />
          <StatPanel label="FID"        value="5.37 ms"   color={T.green} />
          <StatPanel label="Page Loads" value="774"       color={T.blue}  />
          <StatPanel label="Errors"     value="147"       color={T.red}   />
        </div>

        {/* Charts grid */}
        {gridWidth > 0 && (
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={80}
            width={gridWidth}
            onLayoutChange={l => { setLayout(l); localStorage.setItem('grafana-layout', JSON.stringify(l)); }}
            containerPadding={[0, 0]}
            margin={[8, 8]}
            isDraggable isResizable
            compactType="vertical"
            useCSSTransforms
          >
            <div key="page-loads" style={{ height: '100%' }}>
              <Panel title="Page Loads over time" showExplore>
                <BarChart data={pageLoadsData} color={T.blue} name="Page Loads" theme={chartTheme} />
              </Panel>
            </div>

            <div key="js-errors" style={{ height: '100%' }}>
              <Panel title="JavaScript errors" showExplore>
                <BarChart data={jsErrorsData} color={T.red} name="JS Errors" theme={chartTheme} />
              </Panel>
            </div>

            <div key="page-load-p75" style={{ height: '100%' }}>
              <Panel title="Page Load, P75">
                <LineChart series={pageLoadSeries} unit="s" theme={chartTheme} />
              </Panel>
            </div>

            <div key="cls-p75" style={{ height: '100%' }}>
              <Panel title="Cumulative Layout Shift, p75">
                <LineChart series={clsSeries} unit=" ms" theme={chartTheme} />
              </Panel>
            </div>

            <div key="fid-p75" style={{ height: '100%' }}>
              <Panel title="First Input Delay, p75">
                <LineChart series={fidSeries} unit=" ms" theme={chartTheme} />
              </Panel>
            </div>
          </GridLayout>
        )}
      </div>
    </div>
  );
}

// Mount
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
}
