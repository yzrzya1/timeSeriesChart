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

<MultiLineChart datasets={datasets} title="Multi-CPU Usage" />
```

---

### `<AreaChart>`

Area chart visualization for time-series data.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TimeSeriesData[]` | **required** | Array of data points |
| `title` | `string` | - | Chart title |
| `color` | `string` | `"#8884d8"` | Area fill color |
| `strokeWidth` | `number` | `2` | Line thickness |
| `fillOpacity` | `number` | `0.6` | Area fill opacity |
| `height` | `number` | `300` | Chart height in pixels |

---

### `<BarChart>`

Bar chart visualization for categorical or time-series data.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TimeSeriesData[]` | **required** | Array of data points |
| `title` | `string` | - | Chart title |
| `barColor` | `string` | `"#8884d8"` | Bar fill color |
| `height` | `number` | `300` | Chart height in pixels |

---

## Types

### Layout

```typescript
interface Layout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### TimeSeriesData

```typescript
interface TimeSeriesData {
  timestamp: number;
  value: number;
  label?: string;
}
```

---

## Hooks

### `useGridLayout()`

Manage dashboard layout state with automatic persistence.

```jsx
const [layout, setLayout] = useGridLayout('my-dashboard');
```

### `useTimeSeriesData()`

Handle time-series data fetching and caching.

```jsx
const { data, loading, error } = useTimeSeriesData(url, options);
```

---

## Styling & Customization

All components support CSS-in-JS styling and can be customized via props. The library uses CSS modules for scoped styling.

### Theme Configuration

```jsx
<Dashboard theme={{ primaryColor: '#007bff', backgroundColor: '#f8f9fa' }}>
  {/* Content */}
</Dashboard>
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Performance Tips

1. Use memoization for large datasets with `React.memo()`
2. Implement virtual scrolling for dashboards with many widgets
3. Debounce layout change callbacks to avoid excessive re-renders
4. Use time-based data aggregation for aggregated time-series datasets

---

## Troubleshooting

### Chart not rendering

- Ensure data has `timestamp` and `value` fields
- Check that timestamps are in milliseconds (not seconds)
- Verify the chart container has a defined height

### Drag-and-drop not working

- Ensure `isDraggable` prop is `true` on Dashboard
- Check that GridItem has unique `id` values
- Verify ReactDOM is properly mounted

### Performance issues

- Reduce data points via aggregation
- Use horizontal scrolling for large time ranges
- Split large dashboards into multiple smaller ones

---

## License

MIT © Your Organization
