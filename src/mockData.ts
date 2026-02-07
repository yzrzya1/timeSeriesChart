/**
 * Mock data for local development
 * Simulates real-time system metrics and performance data
 */

export interface MockDataPoint {
  timestamp: number;
  value: number;
  label: string;
}

export interface MockDataset {
  id: string;
  name: string;
  data: MockDataPoint[];
  color?: string;
}

/**
 * Generate time-series data with realistic fluctuations
 */
export const generateTimeSeriesData = (
  points: number = 24,
  baseValue: number = 50,
  variance: number = 30,
  intervalMinutes: number = 60
): MockDataPoint[] => {
  const data: MockDataPoint[] = [];
  const now = Date.now();
  const intervalMs = intervalMinutes * 60 * 1000;

  for (let i = points - 1; i >= 0; i--) {
    const timestamp = now - i * intervalMs;
    // Add some realistic variation
    const variation = Math.sin(i / 4) * (variance / 2) + (Math.random() - 0.5) * variance;
    const value = Math.max(0, Math.min(100, baseValue + variation));

    data.push({
      timestamp,
      value: Math.round(value * 10) / 10,
      label: new Date(timestamp).toLocaleString()
    });
  }

  return data;
};

/**
 * CPU Usage Mock Data - Typical server CPU usage between 20-80%
 */
export const mockCpuData: MockDataPoint[] = generateTimeSeriesData(24, 45, 35);

/**
 * Memory Usage Mock Data - Typical server memory between 40-75%
 */
export const mockMemoryData: MockDataPoint[] = generateTimeSeriesData(24, 55, 20);

/**
 * Network I/O Mock Data - Variable network traffic 0-100 Mbps
 */
export const mockNetworkData: MockDataPoint[] = generateTimeSeriesData(24, 35, 40);

/**
 * Disk I/O Mock Data - Storage read/write activity
 */
export const mockDiskData: MockDataPoint[] = generateTimeSeriesData(24, 30, 25);

/**
 * Temperature Mock Data - Server temperature 35-65°C converted to 0-100 scale
 */
export const mockTemperatureData: MockDataPoint[] = generateTimeSeriesData(24, 50, 15);

/**
 * Multi-core CPU data for comparison charts
 */
export const mockMultiCpuData: MockDataset[] = [
  {
    id: 'cpu-1',
    name: 'CPU Core 1',
    data: generateTimeSeriesData(24, 40, 30),
    color: '#FF6B6B'
  },
  {
    id: 'cpu-2',
    name: 'CPU Core 2',
    data: generateTimeSeriesData(24, 35, 32),
    color: '#4ECDC4'
  },
  {
    id: 'cpu-3',
    name: 'CPU Core 3',
    data: generateTimeSeriesData(24, 50, 28),
    color: '#45B7D1'
  },
  {
    id: 'cpu-4',
    name: 'CPU Core 4',
    data: generateTimeSeriesData(24, 42, 35),
    color: '#FFA502'
  }
];

/**
 * Multiple service health metrics
 */
export const mockServiceData: MockDataset[] = [
  {
    id: 'api-server',
    name: 'API Server',
    data: generateTimeSeriesData(24, 70, 15),
    color: '#FF6B6B'
  },
  {
    id: 'database',
    name: 'Database',
    data: generateTimeSeriesData(24, 60, 20),
    color: '#4ECDC4'
  },
  {
    id: 'cache',
    name: 'Cache Server',
    data: generateTimeSeriesData(24, 45, 10),
    color: '#45B7D1'
  },
  {
    id: 'load-balancer',
    name: 'Load Balancer',
    data: generateTimeSeriesData(24, 30, 8),
    color: '#FFA502'
  }
];

/**
 * Disk partitions data
 */
export const mockDiskPartitions: MockDataset[] = [
  {
    id: 'disk-root',
    name: 'Root (/',
    data: generateTimeSeriesData(24, 65, 5),
    color: '#FF6B6B'
  },
  {
    id: 'disk-home',
    name: 'Home (/home)',
    data: generateTimeSeriesData(24, 45, 8),
    color: '#4ECDC4'
  },
  {
    id: 'disk-var',
    name: 'Var (/var)',
    data: generateTimeSeriesData(24, 35, 12),
    color: '#45B7D1'
  },
  {
    id: 'disk-backup',
    name: 'Backup (/backup)',
    data: generateTimeSeriesData(24, 80, 3),
    color: '#FFA502'
  }
];

/**
 * Network interfaces data
 */
export const mockNetworkInterfaces: MockDataset[] = [
  {
    id: 'eth0-in',
    name: 'ETH0 Inbound',
    data: generateTimeSeriesData(24, 40, 30),
    color: '#FF6B6B'
  },
  {
    id: 'eth0-out',
    name: 'ETH0 Outbound',
    data: generateTimeSeriesData(24, 35, 25),
    color: '#4ECDC4'
  },
  {
    id: 'eth1-in',
    name: 'ETH1 Inbound',
    data: generateTimeSeriesData(24, 25, 20),
    color: '#45B7D1'
  },
  {
    id: 'eth1-out',
    name: 'ETH1 Outbound',
    data: generateTimeSeriesData(24, 20, 15),
    color: '#FFA502'
  }
];

/**
 * Request latency data (in milliseconds)
 */
export const mockLatencyData: MockDataPoint[] = generateTimeSeriesData(
  24,
  120, // base latency 120ms
  80,  // variance ±40ms
  60   // 1 hour intervals
).map(point => ({
  ...point,
  value: Math.round(point.value * 3) // Scale to 0-300ms range
}));

/**
 * Error rate data (percentage)
 */
export const mockErrorRateData: MockDataPoint[] = generateTimeSeriesData(24, 2, 3).map(
  point => ({
    ...point,
    value: Math.abs(point.value) // Ensure positive
  })
);

/**
 * Response time percentiles data
 */
export const mockResponseTimePercentiles: MockDataset[] = [
  {
    id: 'p50',
    name: 'p50 (Median)',
    data: generateTimeSeriesData(24, 80, 20),
    color: '#4ECDC4'
  },
  {
    id: 'p95',
    name: 'p95',
    data: generateTimeSeriesData(24, 150, 40),
    color: '#FFA502'
  },
  {
    id: 'p99',
    name: 'p99',
    data: generateTimeSeriesData(24, 250, 60),
    color: '#FF6B6B'
  }
];

/**
 * Active connections data
 */
export const mockConnectionsData: MockDataPoint[] = generateTimeSeriesData(24, 500, 300);

/**
 * Requests per second data
 */
export const mockRequestsPerSecondData: MockDataPoint[] = generateTimeSeriesData(24, 1000, 400);

/**
 * Memory allocation by component
 */
export const mockMemoryAllocation: MockDataset[] = [
  {
    id: 'mem-app',
    name: 'Application',
    data: generateTimeSeriesData(24, 40, 10),
    color: '#FF6B6B'
  },
  {
    id: 'mem-buffer',
    name: 'Buffer Cache',
    data: generateTimeSeriesData(24, 30, 8),
    color: '#4ECDC4'
  },
  {
    id: 'mem-cache',
    name: 'Page Cache',
    data: generateTimeSeriesData(24, 20, 6),
    color: '#45B7D1'
  },
  {
    id: 'mem-free',
    name: 'Free',
    data: generateTimeSeriesData(24, 10, 4),
    color: '#95E1D3'
  }
];

/**
 * System events/logs data (event count per hour)
 */
export const mockEventsData: MockDataPoint[] = generateTimeSeriesData(24, 50, 40).map(
  point => ({
    ...point,
    value: Math.round(point.value * 2) // Scale to 0-200 events
  })
);
