# React Dashboard UI Library - API Documentation

## Overview

React Dashboard UI is a comprehensive, reusable UI library for building interactive dashboards with drag-and-drop capabilities and time-series data visualization. Perfect for monitoring applications, analytics platforms, and real-time data dashboards.

## Installation

```bash
npm install @yourorg/react-dashboard-ui
# or
yarn add @yourorg/react-dashboard-ui
```

## Quick Start

```jsx
import { Dashboard, TimeSeriesChart, GridItem } from '@yourorg/react-dashboard-ui';

function App() {
  const data = [
    { timestamp: 1704067200000, value: 42 },
    { timestamp: 1704153600000, value: 55 },
    { timestamp: 1704240000000, value: 38 }
  ];

  return (
    <Dashboard>
      <GridItem id="chart-1" x={0} y={0} width={6} height={4}>
        <TimeSeriesChart data={data} title="CPU Usage" />
      </GridItem>
    </Dashboard>
  );
}
```

---

## Core Components

### `<Dashboard>`

The main container component that enables drag-and-drop grid layout functionality.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `number` | `12` | Number of columns in the grid |
| `rowHeight` | `number` | `60` | Height of each row in pixels |
| `layout` | `Layout[]` | `[]` | Initial layout configuration |
| `onLayoutChange` | `(layout: Layout[]) => void` | - | Callback when layout changes |
| `isDraggable` | `boolean` | `true` | Enable/disable drag functionality |
| `isResizable` | `boolean` | `true` | Enable/disable resize functionality |
| `children` | `ReactNode` | - | Grid items to render |

#### Example

```jsx
<Dashboard
  cols={12}
  rowHeight={80}
  onLayoutChange={(newLayout) => console.log(newLayout)}
  isDraggable={true}
  isResizable={true}
>
  {/* GridItem components */}
</Dashboard>
```

---

### `<GridItem>`

A draggable and resizable container for dashboard widgets.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Unique identifier for the item |
| `x` | `number` | **required** | Column position (0-indexed) |
| `y` | `number` | **required** | Row position (0-indexed) |
| `width` | `number` | **required** | Width in columns |
| `height` | `number` | **required** | Height in rows |
| `minWidth` | `number` | `1` | Minimum width in columns |
| `minHeight` | `number` | `1` | Minimum height in rows |
| `maxWidth` | `number` | `Infinity` | Maximum width in columns |
| `maxHeight` | `number` | `Infinity` | Maximum height in rows |
| `static` | `boolean` | `false` | Prevent dragging/resizing |
| `children` | `ReactNode` | - | Content to display |

#### Example

```jsx
<GridItem 
  id="widget-1" 
  x={0} 
  y={0} 
  width={4} 
  height={3}
  minWidth={2}
  minHeight={2}
>
  <YourWidget />
</GridItem>
```

---

### `<TimeSeriesChart>`

A line chart optimized for time-series data visualization.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TimeSeriesData[]` | **required** | Array of data points |
| `title` | `string` | - | Chart title |
| `xAxisLabel` | `string` | `"Time"` | Label for x-axis |
| `yAxisLabel` | `string` | `"Value"` | Label for y-axis |
| `color` | `string` | `"#8884d8"` | Line color |
| `strokeWidth` | `number` | `2` | Line thickness |
| `showGrid` | `boolean` | `true` | Show/hide grid lines |
| `showDots` | `boolean` | `true` | Show/hide data point dots |
| `timeFormat` | `string` | `"MMM dd, HH:mm"` | Date format (date-fns) |
| `valueFormatter` | `(value: number) => string` | - | Custom value formatter |
| `height` | `number` | `300` | Chart height in pixels |

#### TimeSeriesData Type

```typescript
interface TimeSeriesData {
  timestamp: number;  // Unix timestamp in milliseconds
  value: number;      // Y-axis value
  label?: string;     // Optional label for tooltip
}
```

#### Example

```jsx
const cpuData = [
  { timestamp: 1704067200000, value: 42, label: "CPU 1" },
  { timestamp: 1704153600000, value: 55, label: "CPU 1" },
  { timestamp: 1704240000000, value: 38, label: "CPU 1" }
];

<TimeSeriesChart
  data={cpuData}
  title="CPU Usage Over Time"
  yAxisLabel="Usage %"
  color="#4CAF50"
  timeFormat="MMM dd, yyyy"
  valueFormatter={(val) => `${val}%`}
/>
```

---

### `<MultiLineChart>`

Display multiple time-series datasets on a single chart.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `datasets` | `MultiLineDataset[]` | **required** | Array of datasets |
| `title` | `string` | - | Chart title |
| `xAxisLabel` | `string` | `"Time"` | Label for x-axis |
| `yAxisLabel` | `string` | `"Value"` | Label for y-axis |
| `showGrid` | `boolean` | `true` | Show/hide grid lines |
| `showLegend` | `boolean` | `true` | Show/hide legend |
| `timeFormat` | `string` | `"MMM dd, HH:mm"` | Date format |
| `height` | `number` | `300` | Chart height in pixels |

#### MultiLineDataset Type

```typescript
interface MultiLineDataset {
  id: string;
  name: string;
  data: TimeSeriesData[];
  color?: string;
  strokeWidth?: number;
}
```

#### Example

```jsx
const datasets = [
  {
    id: "cpu-1",
    name: "CPU 1",
    data: [/* data points */],
    color: "#FF6B6B"
  },
  {
    id: "cpu-2",
    name: "CPU 2",
    data: [/* data points */],
    color: "#4ECDC4"
  }
];

<MultiLineChart
  datasets={datasets}
  title="Multi-Core CPU Usage"
  showLegend={true}
/>
```

---

### `<AreaChart>`

Time-series area chart for showing cumulative or range data.

#### Props

Inherits all props from `<TimeSeriesChart>` with additional:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fillOpacity` | `number` | `0.6` | Area fill opacity (0-1) |
| `gradient` | `boolean` | `false` | Use gradient fill |

#### Example

```jsx
<AreaChart
  data={memoryData}
  title="Memory Usage"
  color="#9C27B0"
  fillOpacity={0.4}
  gradient={true}
/>
```

---

### `<BarChart>`

Bar chart for time-series data comparison.

#### Props

Similar to `<TimeSeriesChart>` with:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `barSize` | `number` | `20` | Width of bars in pixels |
| `barGap` | `number` | `4` | Gap between bars |

---

## Hooks

### `useDashboardLayout`

Manage dashboard layout state with persistence.

#### Returns

```typescript
{
  layout: Layout[];
  setLayout: (layout: Layout[]) => void;
  saveLayout: () => void;
  resetLayout: () => void;
}
```

#### Example

```jsx
import { useDashboardLayout } from '@yourorg/react-dashboard-ui';

function MyDashboard() {
  const { layout, setLayout, saveLayout, resetLayout } = useDashboardLayout('my-dashboard');
  
  return (
    <>
      <button onClick={saveLayout}>Save Layout</button>
      <button onClick={resetLayout}>Reset</button>
      <Dashboard layout={layout} onLayoutChange={setLayout}>
        {/* items */}
      </Dashboard>
    </>
  );
}
```

---

### `useChartData`

Fetch and manage time-series data with automatic refresh.

#### Parameters

```typescript
useChartData(options: {
  fetchFn: () => Promise<TimeSeriesData[]>;
  refreshInterval?: number;  // milliseconds
  enabled?: boolean;
})
```

#### Returns

```typescript
{
  data: TimeSeriesData[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}
```

#### Example

```jsx
import { useChartData } from '@yourorg/react-dashboard-ui';

function LiveChart() {
  const { data, loading, error, refresh } = useChartData({
    fetchFn: async () => {
      const res = await fetch('/api/metrics');
      return res.json();
    },
    refreshInterval: 5000,  // Refresh every 5 seconds
    enabled: true
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <TimeSeriesChart data={data} />;
}
```

---

### `useTimeRange`

Manage time range selection for filtering chart data.

#### Returns

```typescript
{
  startTime: number;
  endTime: number;
  setTimeRange: (start: number, end: number) => void;
  setPreset: (preset: 'hour' | 'day' | 'week' | 'month') => void;
}
```

#### Example

```jsx
const { startTime, endTime, setPreset } = useTimeRange();

<button onClick={() => setPreset('day')}>Last 24 Hours</button>
<TimeSeriesChart 
  data={data.filter(d => d.timestamp >= startTime && d.timestamp <= endTime)} 
/>
```

---

## Utility Functions

### `formatTimestamp(timestamp: number, format?: string): string`

Format Unix timestamp to human-readable string.

```jsx
import { formatTimestamp } from '@yourorg/react-dashboard-ui';

formatTimestamp(1704067200000);  // "Jan 01, 00:00"
formatTimestamp(1704067200000, "yyyy-MM-dd");  // "2024-01-01"
```

---

### `aggregateTimeSeriesData(data: TimeSeriesData[], interval: 'minute' | 'hour' | 'day'): TimeSeriesData[]`

Aggregate data points by time interval.

```jsx
import { aggregateTimeSeriesData } from '@yourorg/react-dashboard-ui';

const hourlyData = aggregateTimeSeriesData(minuteData, 'hour');
```

---

## TypeScript Support

Full TypeScript definitions are included. Import types:

```typescript
import type {
  TimeSeriesData,
  MultiLineDataset,
  Layout,
  DashboardProps,
  GridItemProps,
  TimeSeriesChartProps
} from '@yourorg/react-dashboard-ui';
```

---

## Theming

Customize colors and styles:

```jsx
import { ThemeProvider } from '@yourorg/react-dashboard-ui';

const theme = {
  colors: {
    primary: '#1976D2',
    background: '#FFFFFF',
    text: '#212121',
    grid: '#E0E0E0'
  },
  spacing: {
    gridGap: 16,
    padding: 24
  }
};

<ThemeProvider theme={theme}>
  <Dashboard>
    {/* components */}
  </Dashboard>
</ThemeProvider>
```

---

## Advanced Examples

### Complete Monitoring Dashboard

```jsx
import {
  Dashboard,
  GridItem,
  TimeSeriesChart,
  MultiLineChart,
  useDashboardLayout,
  useChartData
} from '@yourorg/react-dashboard-ui';

function MonitoringDashboard() {
  const { layout, setLayout, saveLayout } = useDashboardLayout('monitoring');
  
  const cpuData = useChartData({
    fetchFn: () => fetch('/api/cpu').then(r => r.json()),
    refreshInterval: 5000
  });

  const memoryData = useChartData({
    fetchFn: () => fetch('/api/memory').then(r => r.json()),
    refreshInterval: 5000
  });

  return (
    <div>
      <button onClick={saveLayout}>Save Layout</button>
      
      <Dashboard 
        layout={layout} 
        onLayoutChange={setLayout}
        cols={12}
        rowHeight={80}
      >
        <GridItem id="cpu" x={0} y={0} width={6} height={4}>
          <TimeSeriesChart
            data={cpuData.data}
            title="CPU Usage"
            yAxisLabel="Usage %"
            color="#FF5722"
            valueFormatter={(val) => `${val.toFixed(1)}%`}
          />
        </GridItem>

        <GridItem id="memory" x={6} y={0} width={6} height={4}>
          <TimeSeriesChart
            data={memoryData.data}
            title="Memory Usage"
            yAxisLabel="GB"
            color="#4CAF50"
          />
        </GridItem>

        <GridItem id="network" x={0} y={4} width={12} height={4}>
          <MultiLineChart
            datasets={[
              { id: "in", name: "Inbound", data: networkIn, color: "#2196F3" },
              { id: "out", name: "Outbound", data: networkOut, color: "#FF9800" }
            ]}
            title="Network Traffic"
            yAxisLabel="MB/s"
          />
        </GridItem>
      </Dashboard>
    </div>
  );
}
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## License

MIT

---

## Contributing

Contributions welcome! Please see CONTRIBUTING.md for guidelines.

## Support

- Documentation: https://docs.yourorg.com/dashboard-ui
- Issues: https://github.com/yourorg/react-dashboard-ui/issues
- Discord: https://discord.gg/yourorg
