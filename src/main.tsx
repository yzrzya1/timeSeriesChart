import React, { useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import GridLayout from 'react-grid-layout';
import * as d3 from 'd3';
import 'react-grid-layout/css/styles.css';
import { generateTimeSeriesData } from './mockData';

// ── Theme ─────────────────────────────────────────────────────────────────────
const T = {
  bg:      '#111217',
  panel:   '#1b1c21',
  border:  'rgba(255,255,255,0.08)',
  text:    '#d9d9d9',
  muted:   '#8e8e8e',
  green:   '#73bf69',
  red:     '#f2495c',
  blue:    '#5794f2',
  yellow:  '#fade2a',
  orange:  '#e0752d',
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const fmt = (label: string) => {
  const d = new Date(label);
  if (isNaN(d.getTime())) return label;
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:00`;
};

const rawPageLoads = generateTimeSeriesData(48, 18, 25, 30);
const rawJsErrors  = generateTimeSeriesData(48,  4,  6, 30);

export const pageLoadsData = rawPageLoads.map(p => ({ label: fmt(p.label), value: Math.round(p.value) }));
export const jsErrorsData  = rawJsErrors.map(p  => ({ label: fmt(p.label), value: Math.round(p.value) }));

const ttfbRaw = generateTimeSeriesData(30, 0.5, 0.3, 240);
const fcpRaw  = generateTimeSeriesData(30, 2.0, 1.5, 240);
const lcpRaw  = generateTimeSeriesData(30, 4.0, 2.0, 240);
const clsRaw  = generateTimeSeriesData(30, 0.15, 0.1, 240);
const fidRaw  = generateTimeSeriesData(30, 10,   8,  240);

export const pageLoadSeries = [
  { key: 'TTFB', color: T.blue,   data: ttfbRaw.map(p => ({ label: fmt(p.label), value: +p.value.toFixed(2) })) },
  { key: 'FCP',  color: T.yellow, data: fcpRaw.map(p  => ({ label: fmt(p.label), value: +p.value.toFixed(2) })) },
  { key: 'LCP',  color: '#ccc',   data: lcpRaw.map(p  => ({ label: fmt(p.label), value: +p.value.toFixed(2) })) },
];
export const clsSeries  = [{ key: 'CLS', color: T.green, data: clsRaw.map(p => ({ label: fmt(p.label), value: +p.value.toFixed(3) })) }];
export const fidSeries  = [{ key: 'FID', color: T.green, data: fidRaw.map(p => ({ label: fmt(p.label), value: +p.value.toFixed(1) })) }];

// ── Hook: track container size ────────────────────────────────────────────────
function useSize(ref: React.RefObject<HTMLElement>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

// ── D3 Bar Chart ──────────────────────────────────────────────────────────────
interface BarDatum  { label: string; value: number }
interface BarChartProps { data: BarDatum[]; color: string; name: string }

const D3BarChart: React.FC<BarChartProps> = ({ data, color, name }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);
  const { w, h } = useSize(rootRef);

  const margin = { top: 8, right: 12, left: 36, bottom: 28 };
  const iw = Math.max(w - margin.left - margin.right, 0);
  const ih = Math.max(h - margin.top  - margin.bottom, 0);

  const xScale = useMemo(() =>
    d3.scaleBand<string>()
      .domain(data.map(d => d.label))
      .range([0, iw])
      .padding(0.35),
    [data, iw]);

  const yMax = useMemo(() => d3.max(data, d => d.value) ?? 1, [data]);
  const yScale = useMemo(() =>
    d3.scaleLinear().domain([0, yMax]).nice().range([ih, 0]),
    [yMax, ih]);

  // Draw axes
  useEffect(() => {
    if (!xAxisRef.current || !yAxisRef.current || iw <= 0) return;

    const every = Math.ceil(data.length / 8);
    d3.select(xAxisRef.current)
      .call(d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter((_, i) => i % every === 0))
        .tickSize(0).tickPadding(6))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll<SVGTextElement, unknown>('text')
        .attr('fill', T.muted).attr('font-size', 10));

    d3.select(yAxisRef.current)
      .call(d3.axisLeft(yScale).ticks(4).tickSize(-iw).tickPadding(6))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll<SVGLineElement, unknown>('.tick line')
        .attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-dasharray', '3,3'))
      .call(g => g.selectAll<SVGTextElement, unknown>('text')
        .attr('fill', T.muted).attr('font-size', 10));
  }, [xScale, yScale, iw, data]);

  const [tip, setTip] = useState<{ bx: number; by: number; label: string; value: number } | null>(null);

  return (
    <div ref={rootRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g ref={yAxisRef} />
          {data.map(d => {
            const bx = xScale(d.label) ?? 0;
            const by = yScale(d.value);
            const bw = xScale.bandwidth();
            const bh = ih - by;
            return (
              <rect
                key={d.label}
                x={bx} y={by} width={bw} height={Math.max(bh, 0)}
                fill={color} rx={2}
                opacity={tip ? (tip.label === d.label ? 1 : 0.6) : 0.8}
                onMouseEnter={() => setTip({ bx: bx + margin.left + bw / 2, by: by + margin.top, label: d.label, value: d.value })}
                onMouseLeave={() => setTip(null)}
                style={{ cursor: 'crosshair' }}
              />
            );
          })}
          <g ref={xAxisRef} transform={`translate(0,${ih})`} />
        </g>
      </svg>

      {tip && (
        <div style={{
          position: 'absolute', pointerEvents: 'none', whiteSpace: 'nowrap',
          left: tip.bx, top: tip.by - 8,
          transform: 'translate(-50%, -100%)',
          background: '#1e2029', border: `1px solid ${T.border}`,
          borderRadius: 4, padding: '6px 10px', fontSize: 11, color: T.text,
        }}>
          <div style={{ color: T.muted, marginBottom: 3 }}>{tip.label}</div>
          <div><span style={{ color }}>{name}</span>: <b>{tip.value}</b></div>
        </div>
      )}
    </div>
  );
};

// ── D3 Line Chart ─────────────────────────────────────────────────────────────
interface LineDatum  { label: string; value: number }
interface LineSeries { key: string; color: string; data: LineDatum[] }
interface LineChartProps { series: LineSeries[]; unit?: string }

const D3LineChart: React.FC<LineChartProps> = ({ series, unit = '' }) => {
  const rootRef  = useRef<HTMLDivElement>(null);
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);
  const { w, h } = useSize(rootRef);

  const margin = { top: 8, right: 16, left: 40, bottom: 32 };
  const iw = Math.max(w - margin.left - margin.right, 0);
  const ih = Math.max(h - margin.top  - margin.bottom, 0);

  const labels = series[0]?.data.map(d => d.label) ?? [];

  const xScale = useMemo(() =>
    d3.scalePoint<string>().domain(labels).range([0, iw]),
    [labels, iw]);

  const yMax = useMemo(() =>
    d3.max(series.flatMap(s => s.data.map(d => d.value))) ?? 1,
    [series]);

  const yScale = useMemo(() =>
    d3.scaleLinear().domain([0, yMax]).nice().range([ih, 0]),
    [yMax, ih]);

  useEffect(() => {
    if (!xAxisRef.current || !yAxisRef.current || iw <= 0) return;

    const every = Math.ceil(labels.length / 6);
    d3.select(xAxisRef.current)
      .call(d3.axisBottom(xScale)
        .tickValues(labels.filter((_, i) => i % every === 0))
        .tickSize(0).tickPadding(6))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll<SVGTextElement, unknown>('text')
        .attr('fill', T.muted).attr('font-size', 10));

    d3.select(yAxisRef.current)
      .call(d3.axisLeft(yScale).ticks(4).tickSize(-iw).tickPadding(6)
        .tickFormat(v => `${v}${unit}`))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll<SVGLineElement, unknown>('.tick line')
        .attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-dasharray', '3,3'))
      .call(g => g.selectAll<SVGTextElement, unknown>('text')
        .attr('fill', T.muted).attr('font-size', 10));
  }, [xScale, yScale, iw, labels, unit]);

  const lineGen = useMemo(() =>
    d3.line<LineDatum>()
      .x(d => xScale(d.label) ?? 0)
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX),
    [xScale, yScale]);

  const [crosshair, setCrosshair] = useState<{ x: number; idx: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const step = iw / Math.max(labels.length - 1, 1);
    const idx = Math.max(0, Math.min(Math.round(mx / step), labels.length - 1));
    setCrosshair({ x: xScale(labels[idx]) ?? 0, idx });
  };

  const tipLeft = crosshair ? (crosshair.x + margin.left > w / 2
    ? crosshair.x + margin.left - 8
    : crosshair.x + margin.left + 12) : 0;
  const tipXform = crosshair && crosshair.x + margin.left > w / 2 ? 'translateX(-100%)' : 'none';

  return (
    <div ref={rootRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g ref={yAxisRef} />

          {series.map(s => (
            <path key={s.key} d={lineGen(s.data) ?? ''} fill="none" stroke={s.color} strokeWidth={1.5} />
          ))}

          {crosshair && (
            <>
              <line
                x1={crosshair.x} y1={0} x2={crosshair.x} y2={ih}
                stroke="rgba(255,255,255,0.25)" strokeWidth={1} strokeDasharray="3,3"
              />
              {series.map(s => (
                <circle
                  key={s.key}
                  cx={crosshair.x}
                  cy={yScale(s.data[crosshair.idx]?.value ?? 0)}
                  r={3.5} fill={s.color} stroke={T.panel} strokeWidth={1.5}
                />
              ))}
            </>
          )}

          <g ref={xAxisRef} transform={`translate(0,${ih})`} />

          {/* Invisible overlay captures mouse events (must be last to be on top) */}
          <rect
            width={iw} height={ih} fill="transparent" style={{ cursor: 'crosshair' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setCrosshair(null)}
          />
        </g>
      </svg>

      {/* Legend */}
      {series.length > 1 && (
        <div style={{ display: 'flex', gap: 12, position: 'absolute', bottom: 4, left: margin.left }}>
          {series.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: T.muted }}>
              <span style={{ width: 16, height: 2, background: s.color, display: 'inline-block', borderRadius: 1 }} />
              {s.key}
            </div>
          ))}
        </div>
      )}

      {/* Tooltip */}
      {crosshair && (
        <div style={{
          position: 'absolute', pointerEvents: 'none', whiteSpace: 'nowrap',
          left: tipLeft, top: margin.top + 8,
          transform: tipXform,
          background: '#1e2029', border: `1px solid ${T.border}`,
          borderRadius: 4, padding: '8px 12px', fontSize: 11, color: T.text, zIndex: 10,
        }}>
          <div style={{ color: T.muted, marginBottom: 6, fontSize: 10 }}>{series[0]?.data[crosshair.idx]?.label}</div>
          {series.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ width: 8, height: 2, background: s.color, display: 'inline-block' }} />
              <span style={{ color: T.muted }}>{s.key}:</span>
              <b>{s.data[crosshair.idx]?.value}{unit}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Stat Panel ────────────────────────────────────────────────────────────────
interface StatPanelProps { label: string; value: string; color: string }
const StatPanel: React.FC<StatPanelProps> = ({ label, value, color }) => (
  <div style={{
    background: T.panel, border: `1px solid ${T.border}`, borderRadius: 4,
    padding: '12px 16px', flex: 1, minWidth: 0,
  }}>
    <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>
      {label} <span style={{ opacity: 0.5 }}>ⓘ</span>
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1.2 }}>{value}</div>
  </div>
);

// ── Chart Panel wrapper ───────────────────────────────────────────────────────
interface PanelProps { title: string; children: ReactNode; showExplore?: boolean }
const Panel: React.FC<PanelProps> = ({ title, children, showExplore }) => (
  <div style={{
    background: T.panel, border: `1px solid ${T.border}`, borderRadius: 4,
    padding: '12px 16px', height: '100%', boxSizing: 'border-box',
    display: 'flex', flexDirection: 'column',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{title}</span>
      {showExplore && (
        <button style={{
          background: 'transparent', border: `1px solid ${T.border}`,
          color: T.muted, padding: '2px 8px', fontSize: 11,
          borderRadius: 3, cursor: 'pointer',
        }}>⊕ Explore</button>
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

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <StatPanel label="TTFB"       value="506 ms"    color={T.green} />
          <StatPanel label="FCP"        value="2.26 min"  color={T.red}   />
          <StatPanel label="CLS"        value="0.0945 ms" color={T.green} />
          <StatPanel label="LCP"        value="3.88 s"    color={T.green} />
          <StatPanel label="FID"        value="5.37 ms"   color={T.green} />
          <StatPanel label="Page Loads" value="774"       color={T.blue}  />
          <StatPanel label="Errors"     value="147"       color={T.red}   />
        </div>

        {/* Charts */}
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
            <div key="page-loads"    style={{ height: '100%' }}>
              <Panel title="Page Loads over time" showExplore>
                <D3BarChart data={pageLoadsData} color={T.blue} name="Page Loads" />
              </Panel>
            </div>
            <div key="js-errors"     style={{ height: '100%' }}>
              <Panel title="JavaScript errors" showExplore>
                <D3BarChart data={jsErrorsData} color={T.red} name="JS Errors" />
              </Panel>
            </div>
            <div key="page-load-p75" style={{ height: '100%' }}>
              <Panel title="Page Load, P75">
                <D3LineChart series={pageLoadSeries} unit="s" />
              </Panel>
            </div>
            <div key="cls-p75"       style={{ height: '100%' }}>
              <Panel title="Cumulative Layout Shift, p75">
                <D3LineChart series={clsSeries} unit=" ms" />
              </Panel>
            </div>
            <div key="fid-p75"       style={{ height: '100%' }}>
              <Panel title="First Input Delay, p75">
                <D3LineChart series={fidSeries} unit=" ms" />
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
