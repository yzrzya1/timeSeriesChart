import React, { useState, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  mockCpuData,
  mockMemoryData,
  mockNetworkData,
  mockDiskData,
  mockMultiCpuData,
  mockTemperatureData,
  mockServiceData,
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

interface DashboardProps {
  children: ReactNode;
}

interface GridItemProps {
  children: ReactNode;
  id: string;
}

// Basic TimeSeriesChart component (placeholder)
const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title, yAxisLabel, color = '#8884d8' }) => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#333' }}>{title}</h3>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        borderRadius: '4px',
        minHeight: '200px'
      }}>
        <div style={{ textAlign: 'center', color: '#999' }}>
          <p>Chart Component Placeholder</p>
          <p style={{ fontSize: '12px' }}>Data points: {data.length}</p>
          <p style={{ fontSize: '12px' }}>Y-Axis: {yAxisLabel}</p>
        </div>
      </div>
    </div>
  );
};

// Dashboard component (placeholder)
const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '20px',
      padding: '20px'
    }}>
      {children}
    </div>
  );
};

// GridItem component
const GridItem: React.FC<GridItemProps> = ({ children, id }) => {
  return <div key={id}>{children}</div>;
};

// Main App Component
export default function App() {
  const [cpuData] = useState(() => mockCpuData);
  const [memoryData] = useState(() => mockMemoryData);
  const [networkData] = useState(() => mockNetworkData);
  const [diskData] = useState(() => mockDiskData);
  const [temperatureData] = useState(() => mockTemperatureData);
  const [multiCpuData] = useState(() => mockMultiCpuData);
  const [serviceData] = useState(() => mockServiceData);
  const [latencyData] = useState(() => mockLatencyData);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '30px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px', color: '#333' }}>
            ✨ React Dashboard UI Library
          </h1>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Real-time system metrics and performance monitoring dashboard
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
        <Dashboard>
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
    </div>
  );
}

// Mount React app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
