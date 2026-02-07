# React Dashboard UI Library

A powerful, flexible React component library for building interactive dashboards with drag-and-drop capabilities and beautiful time-series data visualizations.

![npm version](https://img.shields.io/npm/v/@yourorg/react-dashboard-ui)
![license](https://img.shields.io/npm/l/@yourorg/react-dashboard-ui)

## ✨ Features

- 📊 **Time-Series Visualization** - Beautiful charts optimized for timestamp-based data
- 🎯 **Drag & Drop** - Intuitive grid-based dashboard with full drag-and-drop support
- 🔄 **Reorganize Layouts** - Easily reposition and resize dashboard widgets
- 🎨 **Customizable** - Theming support and extensive styling options
- 📱 **Responsive** - Works seamlessly across different screen sizes
- ⚡ **Performance** - Optimized for real-time data updates
- 🔧 **TypeScript** - Full type safety and IntelliSense support

## 🚀 Quick Start

```bash
npm install @yourorg/react-dashboard-ui
```

```jsx
import { Dashboard, GridItem, TimeSeriesChart } from '@yourorg/react-dashboard-ui';

function App() {
  const data = [
    { timestamp: 1704067200000, value: 42 },
    { timestamp: 1704153600000, value: 55 },
    { timestamp: 1704240000000, value: 38 }
  ];

  return (
    <Dashboard>
      <GridItem id="chart-1" x={0} y={0} width={6} height={4}>
        <TimeSeriesChart 
          data={data} 
          title="System Metrics"
          yAxisLabel="Value"
        />
      </GridItem>
    </Dashboard>
  );
}
```

## 📚 Documentation

- [Live Demo](https://yzrzya1.github.io/timeSeriesChart/) - Interactive dashboard example
- [API Documentation](./docs/API.md) - Complete API reference
- [Examples](./examples) - Live examples and use cases
- [Migration Guide](./docs/MIGRATION.md) - Upgrading from previous versions

## 🎯 Core Components

### Dashboard
The main container that provides drag-and-drop grid functionality.

### GridItem
Draggable and resizable containers for your widgets.

### TimeSeriesChart
Line charts optimized for timestamp data with automatic time formatting.

### MultiLineChart
Compare multiple datasets on a single chart.

### AreaChart & BarChart
Alternative visualizations for different use cases.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start Storybook
npm run storybook
```

## 📦 What's Included

```
react-dashboard-ui/
├── src/
│   ├── components/     # UI components
│   ├── hooks/          # React hooks
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript definitions
├── docs/               # Documentation
└── examples/           # Example implementations
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © Your Organization

## 🙋 Support

- 🌐 [Live Demo](https://yzrzya1.github.io/timeSeriesChart/) - Try the interactive dashboard
- 📖 [Documentation](https://docs.yourorg.com)
- 💬 [Discord Community](https://discord.gg/yourorg)
- 🐛 [Issue Tracker](https://github.com/yourorg/react-dashboard-ui/issues)
