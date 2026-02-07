/**
 * TypeScript type definitions for React Dashboard UI Library
 */

import React from 'react';

// Time-series data point
export interface TimeSeriesData {
  timestamp: number; // Unix timestamp in milliseconds
  value: number; // Y-axis value
  label?: string; // Optional label for tooltip
}

// Dashboard layout item
export interface Layout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  static?: boolean;
}

// Multi-line chart dataset
export interface MultiLineDataset {
  id: string;
  name: string;
  data: TimeSeriesData[];
  color?: string;
  strokeWidth?: number;
}

// Dashboard component props
export interface DashboardProps {
  cols?: number;
  rowHeight?: number;
  layout?: Layout[];
  onLayoutChange?: (layout: Layout[]) => void;
  isDraggable?: boolean;
  isResizable?: boolean;
  children?: React.ReactNode;
  theme?: ThemeConfig;
}

// GridItem component props
export interface GridItemProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  static?: boolean;
  children?: React.ReactNode;
}

// TimeSeriesChart component props
export interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  showDots?: boolean;
  timeFormat?: string;
  valueFormatter?: (value: number) => string;
  height?: number;
  onClick?: (point: TimeSeriesData) => void;
}

// MultiLineChart component props
export interface MultiLineChartProps {
  datasets: MultiLineDataset[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  timeFormat?: string;
  height?: number;
}

// AreaChart component props
export interface AreaChartProps {
  data: TimeSeriesData[];
  title?: string;
  color?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

// BarChart component props
export interface BarChartProps {
  data: TimeSeriesData[];
  title?: string;
  barColor?: string;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

// Theme configuration
export interface ThemeConfig {
  primaryColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  gridColor?: string;
  chartColors?: string[];
}

// Hook return types
export interface UseGridLayoutReturn {
  layout: Layout[];
  setLayout: (layout: Layout[]) => void;
  saveLayout: () => void;
}

export interface UseTimeSeriesDataReturn {
  data: TimeSeriesData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Utility function types
export interface FormatTimeOptions {
  format?: string;
  locale?: any;
}
