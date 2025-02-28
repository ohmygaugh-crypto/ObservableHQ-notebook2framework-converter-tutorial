---
title: Deviations - Product development
---

```js
// Import components
import DotPlot from "./components/DotPlot.js";
import Histogram from "./components/Histogram.js";
import Info from "./components/Info.js";
import { loadData } from "./dataloaders/dataLoader.js";

// Default Z value
const z = 4;

// Load data
const data = await loadData();

// Create sample data for testing if real data fails to load
const sampleData = {
  activities_overdue: [
    { name: "Sample Activity 1", days: 10 },
    { name: "Sample Activity 2", days: 20 },
    { name: "Sample Activity 3", days: 30 }
  ],
  activities_done_delayed: [
    { name: "Sample Activity 1", days: 15 },
    { name: "Sample Activity 2", days: 25 },
    { name: "Sample Activity 3", days: 35 }
  ],
  milestones_overdue: [
    { name: "Sample Milestone 1", days: 12 },
    { name: "Sample Milestone 2", days: 22 },
    { name: "Sample Milestone 3", days: 32 }
  ],
  milestones_done_delayed: [
    { name: "Sample Milestone 1", days: 18 },
    { name: "Sample Milestone 2", days: 28 },
    { name: "Sample Milestone 3", days: 38 }
  ],
  cards_overdue: [
    { name: "Sample Card 1", days: 14 },
    { name: "Sample Card 2", days: 24 },
    { name: "Sample Card 3", days: 34 }
  ]
};

// Use real data if available, otherwise use sample data
const displayData = data.activities_overdue?.length ? data : sampleData;
```

## Overdue activities

```js
DotPlot({ 
  data: displayData.activities_overdue, 
  caption: "Overdue activities", 
  fill: "#375875", 
  z 
})
```

```js
Histogram({ 
  data: displayData.activities_overdue, 
  caption: "Overdue activities", 
  fill: "#375875", 
  z 
})
```

## Overdue milestones

```js
DotPlot({ 
  data: displayData.milestones_overdue, 
  caption: "Overdue milestones", 
  fill: "#375875", 
  z 
})
```

```js
Histogram({ 
  data: displayData.milestones_overdue, 
  caption: "Overdue milestones", 
  fill: "#375875", 
  z 
})
```

## Delayed activities

```js
DotPlot({ 
  data: displayData.activities_done_delayed, 
  caption: "Delayed activities", 
  fill: "#5e8962", 
  z 
})
```

```js
Info({ 
  data: displayData.activities_done_delayed, 
  z 
})
```

```js
Histogram({ 
  data: displayData.activities_done_delayed, 
  caption: "Delayed activities", 
  fill: "#5e8962", 
  z 
})
```

## Delayed milestones

```js
DotPlot({ 
  data: displayData.milestones_done_delayed, 
  caption: "Delayed milestones", 
  fill: "#5e8962", 
  z 
})
```

```js
Info({ 
  data: displayData.milestones_done_delayed, 
  z 
})
```

```js
Histogram({ 
  data: displayData.milestones_done_delayed, 
  caption: "Delayed milestones", 
  fill: "#5e8962", 
  z 
})
```

## Overdue cards

```js
DotPlot({ 
  data: displayData.cards_overdue, 
  caption: "Overdue cards", 
  fill: "#375875", 
  z 
})
```

```js
Histogram({ 
  data: displayData.cards_overdue, 
  caption: "Overdue cards", 
  fill: "#375875", 
  z 
})
```
