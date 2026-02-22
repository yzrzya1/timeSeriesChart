// ─────────────────────────────────────────────────────────────────────────────
// Shared data types
// ─────────────────────────────────────────────────────────────────────────────

/** A single (label, value) data point used by both chart types. */
export interface ChartDatum {
  /** Text displayed on the x-axis tick. */
  label: string;
  /** Numeric value plotted on the y-axis. */
  value: number;
}

/** One series rendered as a line in LineChart. */
export interface LineSeries {
  /** Unique identifier; also shown in the legend and tooltip. */
  key: string;
  /** CSS color string for the line and legend swatch (e.g. `"#5794f2"`, `"red"`). */
  color: string;
  /** Ordered array of data points. All series must share the same labels. */
  data: ChartDatum[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Hover / callback types
// ─────────────────────────────────────────────────────────────────────────────

/** Payload delivered to `onHover` when the user moves over a LineChart. */
export interface LineHoverInfo {
  /** Zero-based index of the hovered data point within the series. */
  index: number;
  /** X-axis label at the hovered position. */
  label: string;
  /** Map of `series.key → value` for every series at this index. */
  values: Record<string, number>;
}

/** Payload delivered to `onHover` when the user hovers a bar in BarChart. */
export type BarHoverInfo = ChartDatum | null;

// ─────────────────────────────────────────────────────────────────────────────
// Theme
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Visual theme tokens shared across chart components.
 * Pass a partial object to `theme` prop to override individual tokens.
 */
export interface ChartTheme {
  /** Primary label/value text colour. */
  textColor: string;
  /** Secondary / muted text colour (axis ticks, legend). */
  mutedColor: string;
  /** Stroke colour for horizontal grid lines. */
  gridColor: string;
  /** Tooltip background. */
  tooltipBg: string;
  /** Tooltip border. */
  tooltipBorder: string;
  /**
   * Background of the chart panel itself.
   * Used as the stroke colour of crosshair dots so they appear "cut out".
   */
  panelBg: string;
}

/** Ready-to-use dark theme that matches a Grafana-style dark dashboard. */
export const darkTheme: ChartTheme = {
  textColor:     '#d9d9d9',
  mutedColor:    '#8e8e8e',
  gridColor:     'rgba(255,255,255,0.06)',
  tooltipBg:     '#1e2029',
  tooltipBorder: 'rgba(255,255,255,0.1)',
  panelBg:       '#1b1c21',
};

/** Ready-to-use light theme. */
export const lightTheme: ChartTheme = {
  textColor:     '#1f2329',
  mutedColor:    '#6b7280',
  gridColor:     'rgba(0,0,0,0.08)',
  tooltipBg:     '#ffffff',
  tooltipBorder: 'rgba(0,0,0,0.12)',
  panelBg:       '#ffffff',
};
