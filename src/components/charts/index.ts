// Components
export { BarChart }  from './BarChart';
export { LineChart } from './LineChart';

// Props types (for consumers who need to type their own wrappers)
export type { BarChartProps }  from './BarChart';
export type { LineChartProps } from './LineChart';

// Shared data / theme types
export type {
  ChartDatum,
  LineSeries,
  LineHoverInfo,
  BarHoverInfo,
  ChartTheme,
} from './types';

// Built-in themes
export { darkTheme, lightTheme } from './types';
