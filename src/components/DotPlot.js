import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

// Define utility functions inline to avoid import issues
const z_score = (data, z) => z * d3.deviation(data) + d3.mean(data);
const outlier_value = (data, z) => z_score(data, z);

export default function DotPlot({ data, caption, fill, z }) {
  if (!data || data.length === 0) {
    console.error("No data provided to DotPlot component");
    return null;
  }

  const y = () => {
    const frac = x => x - (x | 0);
    return i => 50 + 25 * frac(952 * Math.sin((i + 0.5) * 876));
  };

  const outlier_value_ = outlier_value(data.map(d => d.days), z);
  const max_days = d3.max(data, d => d.days);
  data = d3.sort(data, d => d.days);

  console.log("DotPlot - Data received:", data);
  console.log("DotPlot - Z value:", z);
  console.log("DotPlot - Calculated outlier value:", outlier_value_);

  return Plot.plot({
    caption,
    grid: true,
    y: { axis: null },
    marks: [
      outlier_value_ < max_days ? Plot.ruleX([outlier_value_], { stroke: 'red', strokeOpacity: 0.5 }) : [],
      outlier_value_ < max_days ? Plot.barX([1], {
        x1: [outlier_value_],
        x2: [max_days],
        fill: 'red',
        fillOpacity: 0.1,
      }) : [],
      Plot.dot(data, {
        x: 'days',
        title: 'name',
        y: (d, i) => y()(i),
        r: 3,
        fill,
        fillOpacity: 0.5,
      }),
      Plot.ruleX(data, Plot.groupZ({ x: "median" }, { x: 'days', fill })),
      Plot.text(data, Plot.groupZ({
        x: "median",
        text: g => 'Median: ' + d3.format('.2s')(d3.median(g)) + ' days',
      }, {
        x: 'days',
        dx: 5,
        textAnchor: 'start',
        fontSize: 14,
      })),
      Plot.ruleX(data, Plot.groupZ({ x: "mean" }, { x: 'days', fill: 'blue' })),
      Plot.text(data, Plot.groupZ({
        x: "mean",
        text: g => 'Mean: ' + d3.format('.2s')(d3.mean(g)) + ' days',
      }, {
        x: 'days',
        dx: 5,
        dy: 30,
        textAnchor: 'start',
        fontSize: 14,
      })),
      Plot.ruleX(data, Plot.groupZ({ x: "deviation" }, { x: 'days', fill: 'blue' })),
      Plot.text(data, Plot.groupZ({
        x: "mean",
        text: g => 'Deviation: ' + d3.format('.2s')(d3.deviation(g)) + ' days',
      }, {
        x: 'days',
        dx: 5,
        dy: -30,
        textAnchor: 'start',
        fontSize: 14,
      })),
    ]
  });
}
