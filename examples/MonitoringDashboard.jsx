import React, { useState, useEffect } from 'react';
import { Dashboard, GridItem, TimeSeriesChart, MultiLineChart, AreaChart, BarChart } from '@yourorg/react-dashboard-ui';

/**
 * MonitoringDashboard - A complete working example
 * 
 * This example demonstrates a real-time system monitoring dashboard with:
 * - CPU usage monitoring
 * - Memory usage tracking
 * - Network I/O visualization
 * - Disk usage per partition
 */

// Generate mock time-series data
const generateMockData = (baseTime = Date.now(), points = 24) => {
  const data = [];
  const interval = 60 * 60 * 1000; // 1 hour intervals
  
  for (let i = 0; i < points; i++) {
    data.push({
      timestamp: baseTime - (points - i - 1) * interval,
      value: Math.floor(Math.random() * 100),
      label: new Date(baseTime - (points - i - 1) * interval).toLocaleString()
    });
  }
  return data;
};

// Generate multi-dataset mock data
const generateMultiLineData = () => {
  const baseTime = Date.now();
  const interval = 60 * 60 * 1000;
  const points = 24;
  
  const generateCpuData = () => {
    const data = [];
    for (let i = 0; i < points; i++) {
      data.push({
        timestamp: baseTime - (points - i - 1) * interval,
        value: Math.floor(30 + Math.random() * 50),
      });
    }
    return data;
  };
  
  return [
    {
      id: 'cpu-1',
      name: 'CPU 1',
      data: generateCpuData(),
      color: '#FF6B6B',
      strokeWidth: 2
    },
    {
      id: 'cpu-2',
      name: 'CPU 2',
      data: generateCpuData(),
      color: '#4ECDC4',
      strokeWidth: 2
    },
    {
      id: 'cpu-3',
      name: 'CPU 3',
      data: generateCpuData(),
      color: '#45B7D1',
      strokeWidth: 2
    },
    {
      id: 'cpu-4',
      name: 'CPU 4',
      data: generateCpuData(),
      color: '#FFA502',
      strokeWidth: 2
    }
  ];
};

export default function MonitoringDashboard() {
  const [cpuData, setCpuData] = useState(() => generateMockData());
  const [memoryData, setMemoryData] = useState(() => generateMockData());
  const [networkData, setNetworkData] = useState(() => generateMockData());
  const [multiCpuData, setMultiCpuData] = useState(() => generateMultiLineData());
  const [layout, setLayout] = useState([
    { id: 'cpu-chart', x: 0, y: 0, width: 6, height: 4 },
    { id: 'memory-chart', x: 6, y: 0, width: 6, height: 4 },
    { id: 'multi-cpu', x: 0, y: 4, width: 12, height: 4 },
    { id: 'network-chart', x: 0, y: 8, width: 6, height: 4 },
    { id: 'area-chart', x: 6, y: 8, width: 6, height: 4 }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuData(prev => generateMockData());
      setMemoryData(prev => generateMockData());
      setNetworkData(prev => generateMockData());
      setMultiCpuData(prev => generateMultiLineData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    console.log('Layout changed:', newLayout);
    // Persist layout to localStorage
    localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
  };

  const handleChartClick = (point) => {
    console.log('Chart point clicked:', point);
  };

  return (
    <div className="monitoring-dashboard">
      <header className="dashboard-header">
        <h1>System Monitoring Dashboard</h1>
        <p className="dashboard-subtitle">Real-time system metrics and performance monitoring</p>
      </header>

      <Dashboard
        cols={12}
        rowHeight={80}
        layout={layout}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={true}
      >
        {/* CPU Usage Chart */}
        <GridItem id="cpu-chart" x={0} y={0} width={6} height={4}>
          <TimeSeriesChart
            data={cpuData}
            title="CPU Usage"
            yAxisLabel="Usage %"
            color="#FF6B6B"
            strokeWidth={2}
            showGrid={true}
            showDots={true}
            timeFormat="HH:mm"
            valueFormatter={(val) => `${val}%`}
            height={320}
            onClick={handleChartClick}
          />
        </GridItem>

        {/* Memory Usage Chart */}
        <GridItem id="memory-chart" x={6} y={0} width={6} height={4}>
          <TimeSeriesChart
            data={memoryData}
            title="Memory Usage"
            yAxisLabel="Usage %"
            color="#4ECDC4"
            strokeWidth={2}
            showGrid={true}
            showDots={true}
            timeFormat="HH:mm"
            valueFormatter={(val) => `${val}%`}
            height={320}
          />
        </GridItem>

        {/* Multi-CPU Comparison */}
        <GridItem id="multi-cpu" x={0} y={4} width={12} height={4}>
          <MultiLineChart
            datasets={multiCpuData}
            title="Multi-Core CPU Usage Comparison"
            yAxisLabel="Usage %"
            showGrid={true}
            showLegend={true}
            timeFormat="HH:mm"
            height={320}
          />
        </GridItem>

        {/* Network I/O Chart */}
        <GridItem id="network-chart" x={0} y={8} width={6} height={4}>
          <AreaChart
            data={networkData}
            title="Network I/O"
            color="#45B7D1"
            strokeWidth={2}
            fillOpacity={0.3}
            height={320}
            yAxisLabel="Mbps"
          />
        </GridItem>

        {/* Disk Usage Chart */}
        <GridItem id="area-chart" x={6} y={8} width={6} height={4}>
          <BarChart
            data={generateMockData()}
            title="Disk Usage by Partition"
            barColor="#FFA502"
            height={320}
            yAxisLabel="Usage %"
          />
        </GridItem>
      </Dashboard>

      <style jsx>{`
        .monitoring-dashboard {
          padding: 20px;
          background-color: #f5f5f5;
          min-height: 100vh;
        }

        .dashboard-header {
          margin-bottom: 30px;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .dashboard-header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          color: #333;
        }

        .dashboard-subtitle {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
}

/**
 * Usage:
 * 1. Import this component and render it in your app
 * 2. The dashboard includes 5 widgets demonstrating different chart types
 * 3. Drag and drop widgets to rearrange them
 * 4. Resize widgets using the handle in the bottom-right corner
 * 5. The layout is automatically saved to localStorage
 * 6. Real-time data updates occur every 30 seconds
 */
