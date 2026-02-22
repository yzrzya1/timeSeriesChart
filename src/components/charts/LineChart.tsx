import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useSize } from '../../hooks/useSize';
import { darkTheme } from './types';
import type { ChartTheme, LineSeries, LineHoverInfo } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface LineChartProps {
  // ── Data ──────────────────────────────────────────────────────────────────

  /**
   * One or more series to render as lines.
   * All series **must share the same `label` values** (they determine the x-axis).
   *
   * @example
   * series={[
   *   { key: 'TTFB', color: '#5794f2', data: [...] },
   *   { key: 'FCP',  color: '#fade2a', data: [...] },
   * ]}
   */
  series: LineSeries[];

  // ── Axes ──────────────────────────────────────────────────────────────────

  /**
   * Unit string appended to every y-axis tick label and tooltip value.
   * @example unit="ms"  → axis shows "120 ms"
   * @default ""
   */
  unit?: string;

  /**
   * Override the y-axis domain as `[min, max]`.
   * When omitted the domain is computed from the data (`[0, dataMax]`).
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
   * Show a colour-swatch legend below the chart when there are multiple series.
   * @default true
   */
  showLegend?: boolean;

  /**
   * Show a crosshair + tooltip on mouse hover.
   * @default true
   */
  showTooltip?: boolean;

  // ── Theming ───────────────────────────────────────────────────────────────

  /**
   * Partial theme overrides merged on top of `darkTheme`.
   * Pass `lightTheme` from `./types` (or any `ChartTheme`) to switch themes.
   *
   * @example
   * import { lightTheme } from './charts/types';
   * <LineChart theme={lightTheme} ... />
   */
  theme?: Partial<ChartTheme>;

  // ── Callbacks ─────────────────────────────────────────────────────────────

  /**
   * Fires as the user moves over the chart.
   * Receives an object with the hovered index, label, and per-series values.
   * Receives `null` when the cursor leaves the chart.
   *
   * @example
   * onHover={(info) => console.log(info?.values.TTFB)}
   */
  onHover?: (info: LineHoverInfo | null) => void;

  // ── DOM ───────────────────────────────────────────────────────────────────

  /** Applied to the root `<div>` wrapper. */
  className?: string;
  /** Applied to the root `<div>` wrapper. */
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MARGIN = { top: 8, right: 16, left: 40, bottom: 32 } as const;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `LineChart` renders one or more time-series lines using D3.
 *
 * **Quick start**
 * ```tsx
 * import { LineChart } from './components/charts';
 *
 * const data = [
 *   { label: '00:00', value: 120 },
 *   { label: '01:00', value: 85  },
 * ];
 *
 * <LineChart series={[{ key: 'Latency', color: '#73bf69', data }]} unit="ms" />
 * ```
 *
 * The chart fills its container — wrap it in a sized element:
 * ```tsx
 * <div style={{ width: '100%', height: 300 }}>
 *   <LineChart series={...} />
 * </div>
 * ```
 */
export const LineChart: React.FC<LineChartProps> = memo(({
  series,
  unit = '',
  yDomain,
  yTicks = 4,
  xTickInterval,
  showLegend = true,
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

  const labels = series[0]?.data.map(d => d.label) ?? [];

  const xScale = useMemo(
    () => d3.scalePoint<string>().domain(labels).range([0, iw]),
    [labels, iw],
  );

  const dataMax = useMemo(
    () => d3.max(series.flatMap(s => s.data.map(d => d.value))) ?? 1,
    [series],
  );
  const yScale = useMemo(() => {
    const [lo, hi] = yDomain ?? [0, dataMax];
    return d3.scaleLinear().domain([lo, hi]).nice().range([ih, 0]);
  }, [yDomain, dataMax, ih]);

  // Draw D3-managed axes whenever scales or dimensions change
  useEffect(() => {
    if (!xAxisRef.current || !yAxisRef.current || iw <= 0) return;

    const every = xTickInterval ?? Math.ceil(labels.length / 6);

    d3.select(xAxisRef.current)
      .call(
        d3.axisBottom(xScale)
          .tickValues(labels.filter((_, i) => i % every === 0))
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
          .tickPadding(6)
          .tickFormat(v => `${v}${unit}`),
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
  }, [xScale, yScale, iw, labels, unit, yTicks, xTickInterval, theme]);

  const lineGen = useMemo(
    () =>
      d3
        .line<{ label: string; value: number }>()
        .x(d => xScale(d.label) ?? 0)
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX),
    [xScale, yScale],
  );

  const [crosshair, setCrosshair] = useState<{ x: number; idx: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    if (!showTooltip) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const step = iw / Math.max(labels.length - 1, 1);
    const idx  = Math.max(0, Math.min(Math.round((e.clientX - rect.left) / step), labels.length - 1));
    setCrosshair({ x: xScale(labels[idx]) ?? 0, idx });
    onHover?.({
      index: idx,
      label: labels[idx],
      values: Object.fromEntries(series.map(s => [s.key, s.data[idx]?.value ?? 0])),
    });
  };

  const handleMouseLeave = () => {
    setCrosshair(null);
    onHover?.(null);
  };

  // Flip tooltip to the left when it would overflow the right edge
  const tipOnRight = crosshair ? crosshair.x + MARGIN.left <= w / 2 : true;

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

          {/* Lines */}
          {series.map(s => (
            <path
              key={s.key}
              d={lineGen(s.data) ?? ''}
              fill="none"
              stroke={s.color}
              strokeWidth={1.5}
            />
          ))}

          {/* Crosshair */}
          {crosshair && (
            <>
              <line
                x1={crosshair.x} y1={0}
                x2={crosshair.x} y2={ih}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
              {series.map(s => (
                <circle
                  key={s.key}
                  cx={crosshair.x}
                  cy={yScale(s.data[crosshair.idx]?.value ?? 0)}
                  r={3.5}
                  fill={s.color}
                  stroke={theme.panelBg}
                  strokeWidth={1.5}
                />
              ))}
            </>
          )}

          {/* x-axis (drawn by D3) */}
          <g ref={xAxisRef} transform={`translate(0,${ih})`} />

          {/* Invisible overlay — captures pointer events above everything else */}
          <rect
            width={iw}
            height={ih}
            fill="transparent"
            style={{ cursor: 'crosshair' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </g>
      </svg>

      {/* Legend */}
      {showLegend && series.length > 1 && (
        <div style={{ display: 'flex', gap: 12, position: 'absolute', bottom: 4, left: MARGIN.left }}>
          {series.map(s => (
            <div
              key={s.key}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: theme.mutedColor }}
            >
              <span style={{ width: 16, height: 2, background: s.color, display: 'inline-block', borderRadius: 1 }} />
              {s.key}
            </div>
          ))}
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && crosshair && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
            left: tipOnRight
              ? crosshair.x + MARGIN.left + 12
              : crosshair.x + MARGIN.left - 8,
            top: MARGIN.top + 8,
            transform: tipOnRight ? 'none' : 'translateX(-100%)',
            background: theme.tooltipBg,
            border: `1px solid ${theme.tooltipBorder}`,
            borderRadius: 4,
            padding: '8px 12px',
            fontSize: 11,
            color: theme.textColor,
          }}
        >
          <div style={{ color: theme.mutedColor, marginBottom: 6, fontSize: 10 }}>
            {series[0]?.data[crosshair.idx]?.label}
          </div>
          {series.map(s => (
            <div
              key={s.key}
              style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}
            >
              <span style={{ width: 8, height: 2, background: s.color, display: 'inline-block' }} />
              <span style={{ color: theme.mutedColor }}>{s.key}:</span>
              <b>{s.data[crosshair.idx]?.value}{unit}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

LineChart.displayName = 'LineChart';
