# Chart Components

D3-powered chart components for building dark-themed monitoring dashboards.
Built with **React 16.8+**, **D3 v7**, and **TypeScript**.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [BarChart](#barchart)
  - [Props](#barchart-props)
  - [Examples](#barchart-examples)
- [LineChart](#linechart)
  - [Props](#linechart-props)
  - [Examples](#linechart-examples)
- [Types Reference](#types-reference)
- [Theming](#theming)
- [useSize Hook](#usesize-hook)

---

## Installation

```bash
npm install d3 @types/d3
```

Import the components:

```tsx
import { BarChart, LineChart } from './components/charts';

// Types (if you need them)
import type { ChartDatum, LineSeries, ChartTheme } from './components/charts';

// Built-in themes
import { darkTheme, lightTheme } from './components/charts';
```

---

## Quick Start

Both charts **fill their container**. Always wrap them in a sized parent:

```tsx
<div style={{ width: '100%', height: 300 }}>
  <BarChart data={data} color="#5794f2" name="Page Loads" />
</div>

<div style={{ width: '100%', height: 300 }}>
  <LineChart series={series} unit="ms" />
</div>
```

---

## BarChart

Renders a vertical bar chart. Suitable for event counts, histograms, and discrete time-bucketed data.

```
┌─────────────────────────────────────┐
│                                     │
│  ▐█▌  ▐█▌                   ▐█▌    │  ← bars (color prop)
│  ▐█▌  ▐█▌  ▐█▌  ▐█▌  ▐█▌   ▐█▌    │
│  ▐█▌  ▐█▌  ▐█▌  ▐█▌  ▐█▌   ▐█▌    │
└──────────────────────────────────────┘
  06/23 06/24 06/25 06/26 06/27       ← x-axis (label)
```

### BarChart Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **`data`** ⚠️ | `ChartDatum[]` | — | **Required.** Array of `{ label, value }` objects, one per bar. |
| `color` | `string` | `"#5794f2"` | CSS color for all bars (hex, rgb, named color). |
| `name` | `string` | `"Value"` | Series name displayed in the hover tooltip. |
| `barPadding` | `number` | `0.35` | Gap between bars as a fraction of band width. Range `0–1`. Higher → thinner bars. |
| `barRadius` | `number` | `2` | Corner radius (px) on bar tops. `0` for flat tops. |
| `barOpacity` | `number` | `0.8` | Default bar opacity. Hovered bar is always `1.0`. Non-hovered bars dim to `barOpacity × 0.5`. |
| `yDomain` | `[number, number]` | auto | Override y-axis range. Defaults to `[0, max(data.value)]`. |
| `yTicks` | `number` | `4` | Number of y-axis grid lines / tick marks. |
| `xTickInterval` | `number` | auto | Show every Nth x-axis label. Auto-calculated from data length when omitted. |
| `showTooltip` | `boolean` | `true` | Show label + value tooltip on bar hover. |
| `theme` | `Partial<ChartTheme>` | `darkTheme` | Visual theme tokens. Pass `lightTheme` or custom partial to override. |
| `onHover` | `(info: ChartDatum \| null) => void` | — | Callback fired on bar mouseenter. Receives `null` on mouseleave. |
| `className` | `string` | — | CSS class applied to the root `<div>`. |
| `style` | `CSSProperties` | — | Inline styles applied to the root `<div>`. |

### BarChart Examples

**Minimal — event count over time:**

```tsx
const data = [
  { label: '06/23', value: 12 },
  { label: '06/24', value: 47 },
  { label: '06/25', value: 8  },
];

<div style={{ height: 200 }}>
  <BarChart data={data} color="#f2495c" name="JS Errors" />
</div>
```

**Custom y-axis and density:**

```tsx
<BarChart
  data={data}
  color="#73bf69"
  name="Requests"
  yDomain={[0, 100]}   // fixed scale — useful when comparing panels
  yTicks={5}
  barPadding={0.2}      // wider bars
  barRadius={4}
/>
```

**Listen to hover events:**

```tsx
const [hovered, setHovered] = useState<ChartDatum | null>(null);

<BarChart
  data={data}
  color="#5794f2"
  name="Page Loads"
  onHover={setHovered}
/>

{hovered && <p>Hovered: {hovered.label} → {hovered.value}</p>}
```

**Light theme:**

```tsx
import { lightTheme } from './components/charts';

<BarChart data={data} theme={lightTheme} color="#1a73e8" />
```

**Disable tooltip (e.g. in a sparkline):**

```tsx
<BarChart data={data} showTooltip={false} barPadding={0.1} />
```

---

## LineChart

Renders one or more continuous lines with a hover crosshair, dot indicators, and an optional legend.
Suitable for time-series metrics, percentile trends, and multi-metric comparison.

```
s │  ╭──────────╮                        ← LCP (grey)
  │╭─╯           ╰──╮  ╭────────────────
  ││                 ╰──╯               ← FCP (yellow)
  │╰────────────────────────────────────  ← TTFB (blue)
  └────────────────────────────────────
   06/23  06/24  06/25  06/26  06/27
   ■ TTFB  ■ FCP  ■ LCP                 ← legend
```

### LineChart Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **`series`** ⚠️ | `LineSeries[]` | — | **Required.** One or more series. All series must share the same `label` values. |
| `unit` | `string` | `""` | Suffix appended to y-axis ticks and tooltip values. E.g. `"ms"`, `"s"`, `"%"`. |
| `yDomain` | `[number, number]` | auto | Override y-axis range. Defaults to `[0, max across all series]`. |
| `yTicks` | `number` | `4` | Number of y-axis grid lines / ticks. |
| `xTickInterval` | `number` | auto | Show every Nth x-axis label. Auto-calculated when omitted. |
| `showLegend` | `boolean` | `true` | Show colour-swatch legend when `series.length > 1`. |
| `showTooltip` | `boolean` | `true` | Show crosshair + tooltip on hover. Disable for sparklines. |
| `theme` | `Partial<ChartTheme>` | `darkTheme` | Visual theme tokens. |
| `onHover` | `(info: LineHoverInfo \| null) => void` | — | Fires on mouse move with index, label, and per-series values. `null` on leave. |
| `className` | `string` | — | CSS class on root `<div>`. |
| `style` | `CSSProperties` | — | Inline styles on root `<div>`. |

### LineChart Examples

**Single series — latency:**

```tsx
const data = [
  { label: '00:00', value: 120 },
  { label: '01:00', value: 85  },
  { label: '02:00', value: 210 },
];

<div style={{ height: 300 }}>
  <LineChart
    series={[{ key: 'Latency', color: '#73bf69', data }]}
    unit="ms"
  />
</div>
```

**Multi-series — Web Vitals P75:**

```tsx
const series = [
  { key: 'TTFB', color: '#5794f2', data: ttfbData },
  { key: 'FCP',  color: '#fade2a', data: fcpData  },
  { key: 'LCP',  color: '#cccccc', data: lcpData  },
];

<LineChart series={series} unit="s" yDomain={[0, 10]} />
```

**Read hover values (sync with external UI):**

```tsx
const [info, setInfo] = useState<LineHoverInfo | null>(null);

<LineChart series={series} unit="ms" onHover={setInfo} />

{info && (
  <div>
    {info.label}: TTFB={info.values.TTFB}ms, LCP={info.values.LCP}ms
  </div>
)}
```

**Fixed y-axis for side-by-side comparison:**

```tsx
// Two panels that always share the same y scale — easy to compare visually
<LineChart series={[cpuSeries]}  yDomain={[0, 100]} unit="%" />
<LineChart series={[memSeries]}  yDomain={[0, 100]} unit="%" />
```

**Sparkline (no axes, no tooltip):**

```tsx
<div style={{ width: 120, height: 40 }}>
  <LineChart
    series={[{ key: 'val', color: '#73bf69', data }]}
    showTooltip={false}
    showLegend={false}
  />
</div>
```

---

## Types Reference

### `ChartDatum`

A single data point shared by both chart types.

```ts
interface ChartDatum {
  label: string;   // x-axis text (e.g. "06/23 14:00")
  value: number;   // y-axis value
}
```

### `LineSeries`

One line in a `LineChart`.

```ts
interface LineSeries {
  key:   string;        // unique ID + legend label
  color: string;        // CSS color string
  data:  ChartDatum[];  // must match labels of all other series
}
```

### `LineHoverInfo`

Payload passed to `LineChart.onHover`.

```ts
interface LineHoverInfo {
  index:  number;                  // zero-based index into the data array
  label:  string;                  // x-axis label at that position
  values: Record<string, number>;  // { [series.key]: value } for every series
}
```

### `ChartTheme`

Full theme token set. Pass a `Partial<ChartTheme>` to either component's `theme` prop.

```ts
interface ChartTheme {
  textColor:     string;  // primary text (tooltip values, axis labels)
  mutedColor:    string;  // secondary text (axis ticks, legend, tooltip labels)
  gridColor:     string;  // horizontal grid line stroke
  tooltipBg:     string;  // tooltip background
  tooltipBorder: string;  // tooltip border
  panelBg:       string;  // panel background (used to "cut out" crosshair dots)
}
```

---

## Theming

Two built-in themes are exported:

```ts
import { darkTheme, lightTheme } from './components/charts';
```

| Token | `darkTheme` | `lightTheme` |
|-------|------------|-------------|
| `textColor` | `#d9d9d9` | `#1f2329` |
| `mutedColor` | `#8e8e8e` | `#6b7280` |
| `gridColor` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.08)` |
| `tooltipBg` | `#1e2029` | `#ffffff` |
| `tooltipBorder` | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.12)` |
| `panelBg` | `#1b1c21` | `#ffffff` |

**Partial override** — only change what you need:

```tsx
<LineChart
  series={series}
  theme={{ tooltipBg: '#000', tooltipBorder: '#444' }}
/>
```

**Full custom theme:**

```tsx
const myTheme: ChartTheme = {
  textColor:     '#e2e8f0',
  mutedColor:    '#94a3b8',
  gridColor:     'rgba(255,255,255,0.05)',
  tooltipBg:     '#0f172a',
  tooltipBorder: '#334155',
  panelBg:       '#1e293b',
};

<BarChart data={data} theme={myTheme} />
<LineChart series={series} theme={myTheme} />
```

---

## useSize Hook

Tracks a DOM element's rendered size via `ResizeObserver`. Used internally by both charts; exported for custom D3 components.

```ts
import { useSize } from './hooks/useSize';

function MyChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { w, h } = useSize(containerRef);
  // w and h update automatically on resize
}
```

**Signature:**

```ts
function useSize(ref: React.RefObject<HTMLElement>): { w: number; h: number }
```

Returns `{ w: 0, h: 0 }` until the element mounts.
