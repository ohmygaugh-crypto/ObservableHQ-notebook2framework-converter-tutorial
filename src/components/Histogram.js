import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

// Define utility functions inline to avoid import issues
const z_score = (data, z) => z * d3.deviation(data) + d3.mean(data);
const outlier_value = (data, z) => z_score(data, z);

export default function Histogram({ data, caption, fill, z }) {
  if (!data || data.length === 0) {
    console.error("No data provided to Histogram component");
    return null;
  }

  console.log("Histogram - Data received:", data);
  console.log("Histogram - Z value:", z);

  const outlier_value_ = outlier_value(data.map(d => d.days), z);
  data = data.filter(d => d.days <= outlier_value_);

  return Plot.plot({
    caption,
    y: { grid: true },
    x: { nice: true },
    marks: [
      Plot.rectY(data, Plot.binX({
        y: "count",
        title: "count"
      }, {
        x: "days",
        fill,
      }))
    ]
  });
}
