import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useSize } from '../../hooks/useSize';
import { darkTheme } from './types';
import type { BarHoverInfo, ChartDatum, ChartTheme } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface BarChartProps {
  // ── Data ──────────────────────────────────────────────────────────────────

  /**
   * Array of `{ label, value }` objects — one per bar.
   *
   * @example
   * data={[
   *   { label: '06/23', value: 12 },
   *   { label: '06/24', value: 47 },
   * ]}
   */
  data: ChartDatum[];

  // ── Appearance ────────────────────────────────────────────────────────────

  /**
   * Fill colour for all bars.
   * @default "#5794f2"
   */
  color?: string;

  /**
   * Series name shown in the hover tooltip.
   * @default "Value"
   */
  name?: string;

  /**
   * Inner padding between bars as a fraction of the band width (0 – 1).
   * Higher values → thinner bars with more space.
   * @default 0.35
   */
  barPadding?: number;

  /**
   * Corner radius (px) applied to bar tops.
   * @default 2
   */
  barRadius?: number;

  /**
   * Opacity of bars when none is hovered.
   * Hovered bar is always rendered at full opacity (1).
   * @default 0.8
   */
  barOpacity?: number;

  // ── Axes ──────────────────────────────────────────────────────────────────

  /**
   * Override the y-axis domain as `[min, max]`.
   * Defaults to `[0, dataMax]`.
   * @example yDomain={[0, 100]}
   */
  yDomain?: [number, number];

  /**
   * Number of y-axis ticks (grid lines).
   * @default 4
   */
  yTicks?: number;

  /**
   * Render every Nth x-axis label.
   * Auto-calculated to avoid overlaps when omitted.
   */
  xTickInterval?: number;

  // ── Features ──────────────────────────────────────────────────────────────

  /**
   * Show a tooltip on bar hover.
   * @default true
   */
  showTooltip?: boolean;

  // ── Theming ───────────────────────────────────────────────────────────────

  /**
   * Partial theme overrides merged on top of `darkTheme`.
   * @example
   * import { lightTheme } from './charts/types';
   * <BarChart theme={lightTheme} ... />
   */
  theme?: Partial<ChartTheme>;

  // ── Callbacks ─────────────────────────────────────────────────────────────

  /**
   * Fires when the user hovers a bar.
   * Receives the hovered `{ label, value }` datum, or `null` on mouse-leave.
   *
   * @example
   * onHover={(d) => d && console.log(d.label, d.value)}
   */
  onHover?: (info: BarHoverInfo) => void;

  // ── DOM ───────────────────────────────────────────────────────────────────

  /** Applied to the root `<div>` wrapper. */
  className?: string;
  /** Applied to the root `<div>` wrapper. */
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MARGIN = { top: 8, right: 12, left: 36, bottom: 28 } as const;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `BarChart` renders a vertical bar chart using D3.
 *
 * **Quick start**
 * ```tsx
 * import { BarChart } from './components/charts';
 *
 * const data = [
 *   { label: '06/23', value: 12 },
 *   { label: '06/24', value: 47 },
 * ];
 *
 * <div style={{ width: '100%', height: 300 }}>
 *   <BarChart data={data} color="#f2495c" name="JS Errors" />
 * </div>
 * ```
 */
export const BarChart: React.FC<BarChartProps> = memo(({
  data,
  color = '#5794f2',
  name = 'Value',
  barPadding = 0.35,
  barRadius = 2,
  barOpacity = 0.8,
  yDomain,
  yTicks = 4,
  xTickInterval,
  showTooltip = true,
  theme: themeOverride,
  onHover,
  className,
  style,
}) => {
  const theme: ChartTheme = { ...darkTheme, ...themeOverride };

  const rootRef  = useRef<HTMLDivElement>(null);
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);
  const { w, h } = useSize(rootRef);

  const iw = Math.max(w - MARGIN.left - MARGIN.right, 0);
  const ih = Math.max(h - MARGIN.top  - MARGIN.bottom, 0);

  const xScale = useMemo(
    () =>
      d3
        .scaleBand<string>()
        .domain(data.map(d => d.label))
        .range([0, iw])
        .padding(barPadding),
    [data, iw, barPadding],
  );

  const dataMax = useMemo(() => d3.max(data, d => d.value) ?? 1, [data]);
  const yScale  = useMemo(() => {
    const [lo, hi] = yDomain ?? [0, dataMax];
    return d3.scaleLinear().domain([lo, hi]).nice().range([ih, 0]);
  }, [yDomain, dataMax, ih]);

  // Draw D3-managed axes whenever scales or dimensions change
  useEffect(() => {
    if (!xAxisRef.current || !yAxisRef.current || iw <= 0) return;

    const every = xTickInterval ?? Math.ceil(data.length / 8);

    d3.select(xAxisRef.current)
      .call(
        d3.axisBottom(xScale)
          .tickValues(xScale.domain().filter((_, i) => i % every === 0))
          .tickSize(0)
          .tickPadding(6),
      )
      .call(g => g.select('.domain').remove())
      .call(g =>
        g.selectAll<SVGTextElement, unknown>('text')
          .attr('fill', theme.mutedColor)
          .attr('font-size', 10),
      );

    d3.select(yAxisRef.current)
      .call(
        d3.axisLeft(yScale)
          .ticks(yTicks)
          .tickSize(-iw)
          .tickPadding(6),
      )
      .call(g => g.select('.domain').remove())
      .call(g =>
        g.selectAll<SVGLineElement, unknown>('.tick line')
          .attr('stroke', theme.gridColor)
          .attr('stroke-dasharray', '3,3'),
      )
      .call(g =>
        g.selectAll<SVGTextElement, unknown>('text')
          .attr('fill', theme.mutedColor)
          .attr('font-size', 10),
      );
  }, [xScale, yScale, iw, data, yTicks, xTickInterval, theme]);

  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const handleBarEnter = (d: ChartDatum) => {
    setHoveredLabel(d.label);
    onHover?.(d);
  };
  const handleBarLeave = () => {
    setHoveredLabel(null);
    onHover?.(null);
  };

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative', ...style }}
    >
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Grid + y-axis (drawn by D3) */}
          <g ref={yAxisRef} />

          {/* Bars */}
          {data.map(d => {
            const bx = xScale(d.label) ?? 0;
            const by = yScale(d.value);
            const bw = xScale.bandwidth();
            const bh = Math.max(ih - by, 0);
            const isHovered = d.label === hoveredLabel;
            return (
              <rect
                key={d.label}
                x={bx}
                y={by}
                width={bw}
                height={bh}
                fill={color}
                rx={barRadius}
                opacity={hoveredLabel === null ? barOpacity : isHovered ? 1 : barOpacity * 0.5}
                style={{ cursor: 'crosshair', transition: 'opacity 80ms' }}
                onMouseEnter={() => handleBarEnter(d)}
                onMouseLeave={handleBarLeave}
              />
            );
          })}

          {/* x-axis (drawn by D3) */}
          <g ref={xAxisRef} transform={`translate(0,${ih})`} />
        </g>
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredLabel !== null && (() => {
        const d = data.find(p => p.label === hoveredLabel)!;
        const bx = (xScale(d.label) ?? 0) + MARGIN.left + xScale.bandwidth() / 2;
        const by = yScale(d.value) + MARGIN.top;
        return (
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              left: bx,
              top: by - 8,
              transform: 'translate(-50%, -100%)',
              background: theme.tooltipBg,
              border: `1px solid ${theme.tooltipBorder}`,
              borderRadius: 4,
              padding: '6px 10px',
              fontSize: 11,
              color: theme.textColor,
            }}
          >
            <div style={{ color: theme.mutedColor, marginBottom: 3 }}>{d.label}</div>
            <div>
              <span style={{ color }}>{name}</span>: <b>{d.value}</b>
            </div>
          </div>
        );
      })()}
    </div>
  );
});

BarChart.displayName = 'BarChart';
