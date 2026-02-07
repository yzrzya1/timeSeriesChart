import React, { useState, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import GridLayout from 'react-grid-layout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  mockCpuData,
  mockMemoryData,
  mockNetworkData,
  mockDiskData,
  mockTemperatureData,
  mockLatencyData,
  mockErrorRateData,
  mockConnectionsData
} from './mockData';

/**
 * Main entry point for the React Dashboard UI example
 * Runs on localhost:4001
 */

// Type definitions
interface DataPoint {
  timestamp: number;
  value: number;
  label: string;
}

interface TimeSeriesChartProps {
  data: DataPoint[];
  title: string;
  yAxisLabel: string;
  color?: string;
}

interface GridItemProps {
  children: ReactNode;
  id: string;
}

// Basic TimeSeriesChart component
const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title, yAxisLabel, color = '#8884d8' }) => {
  return (
    <div style={{
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '0px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'grab'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600', color: '#333' }}>{title}</h3>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: `2px solid ${color}` }}
              formatter={(value: any) => [`${value}`, yAxisLabel]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Dashboard component with drag and drop
interface DashboardProps {
  children: ReactNode;
  layout: any[];
  onLayoutChange: (layout: any[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ children, layout, onLayoutChange }) => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
      <GridLayout
        className="layout"
        layout={layout}
        onLayoutChange={onLayoutChange}
        cols={12}
        rowHeight={80}
        width={1200}
        isDraggable={true}
        isResizable={true}
        compactType="vertical"
        preventCollision={false}
        useCSSTransforms={true}
      >
        {children}
      </GridLayout>
    </div>
  );
};

// GridItem component - wrapper for grid layout items
const GridItem: React.FC<GridItemProps> = ({ children, id }) => {
  return (
    <div
      key={id}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '0px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
};

// Main App Component
export default function App() {
  const defaultLayout = [
    { x: 0, y: 0, w: 6, h: 4, i: 'cpu-chart' },
    { x: 6, y: 0, w: 6, h: 4, i: 'memory-chart' },
    { x: 0, y: 4, w: 6, h: 4, i: 'network-chart' },
    { x: 6, y: 4, w: 6, h: 4, i: 'disk-chart' },
    { x: 0, y: 8, w: 6, h: 4, i: 'temperature-chart' },
    { x: 6, y: 8, w: 6, h: 4, i: 'latency-chart' },
    { x: 0, y: 12, w: 6, h: 4, i: 'error-rate-chart' },
    { x: 6, y: 12, w: 6, h: 4, i: 'connections-chart' }
  ];

  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem('dashboard-layout');
    return saved ? JSON.parse(saved) : defaultLayout;
  });

  const [cpuData] = useState(() => mockCpuData);
  const [memoryData] = useState(() => mockMemoryData);
  const [networkData] = useState(() => mockNetworkData);
  const [diskData] = useState(() => mockDiskData);
  const [temperatureData] = useState(() => mockTemperatureData);
  const [latencyData] = useState(() => mockLatencyData);

  const handleLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
    localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '30px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px', color: '#333' }}>
            ✨ React Dashboard UI Library
          </h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            Real-time system metrics and performance monitoring dashboard
          </p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            💡 Drag and drop to rearrange widgets • Resize to customize layout
          </p>
        </div>
      </header>

      {/* Dashboard */}
      <div style={{ maxWidth: '100%', paddingBottom: '40px' }}>
        <Dashboard layout={layout} onLayoutChange={handleLayoutChange}>
          <GridItem id="cpu-chart">
            <TimeSeriesChart
              data={cpuData}
              title="📊 CPU Usage"
              yAxisLabel="Usage %"
              color="#FF6B6B"
            />
          </GridItem>

          <GridItem id="memory-chart">
            <TimeSeriesChart
              data={memoryData}
              title="💾 Memory Usage"
              yAxisLabel="Usage %"
              color="#4ECDC4"
            />
          </GridItem>

          <GridItem id="network-chart">
            <TimeSeriesChart
              data={networkData}
              title="🌐 Network I/O"
              yAxisLabel="Mbps"
              color="#45B7D1"
            />
          </GridItem>

          <GridItem id="disk-chart">
            <TimeSeriesChart
              data={diskData}
              title="💿 Disk I/O"
              yAxisLabel="Activity %"
              color="#FFA502"
            />
          </GridItem>

          <GridItem id="temperature-chart">
            <TimeSeriesChart
              data={temperatureData}
              title="🌡️ Temperature"
              yAxisLabel="Celsius"
              color="#FF8C94"
            />
          </GridItem>

          <GridItem id="latency-chart">
            <TimeSeriesChart
              data={latencyData}
              title="⏱️ Response Latency"
              yAxisLabel="Milliseconds"
              color="#A8E6CF"
            />
          </GridItem>

          <GridItem id="error-rate-chart">
            <TimeSeriesChart
              data={mockErrorRateData}
              title="❌ Error Rate"
              yAxisLabel="Percentage %"
              color="#FF6B6B"
            />
          </GridItem>

          <GridItem id="connections-chart">
            <TimeSeriesChart
              data={mockConnectionsData}
              title="🔗 Active Connections"
              yAxisLabel="Count"
              color="#4ECDC4"
            />
          </GridItem>
        </Dashboard>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'white',
        padding: '20px',
        textAlign: 'center',
        borderTop: '1px solid #eee',
        color: '#666',
        fontSize: '12px'
      }}>
        <p>React Dashboard UI Library running on localhost:4001</p>
        <p>📖 <a href="#" style={{ color: '#0066cc', textDecoration: 'none' }}>View Documentation</a></p>
      </footer>

      <style>{`
        .layout {
          background: #f5f5f5;
        }
        .react-grid-layout {
          position: relative;
          transition: height 200ms ease;
        }
        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top;
        }
        .react-grid-item img {
          pointer-events: none;
          user-select: none;
        }
        .react-grid-item.css-transforms {
          transition-property: transform;
        }
        .react-grid-item.resizing {
          transition: none;
          z-index: 1000;
          will-change: width, height;
        }
        .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 3000;
          will-change: transform;
        }
        .react-grid-item.dropping {
          visibility: hidden;
        }
        .react-grid-item.react-grid-placeholder {
          background: #0066cc;
          opacity: 0.2;
          border-radius: 8px;
          z-index: 2;
          border: none;
        }
        .react-grid-item.react-grid-placeholder.placeholder-animated {
          transition: all 100ms ease;
        }
        .react-draggable-dragging {
          opacity: 0.3;
        }
        .react-resizable-hide > .react-resizable-handle {
          display: none;
        }
        .react-grid-item > .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
        }
        .react-grid-item > .react-resizable-handle::after {
          content: "";
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 5px;
          height: 5px;
          border-right: 2px solid rgba(0, 0, 0, 0.4);
          border-bottom: 2px solid rgba(0, 0, 0, 0.4);
        }
        .react-resizable {
          position: relative;
        }
        .react-resizable-hide {
          height: 0;
          width: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

// Mount React app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
