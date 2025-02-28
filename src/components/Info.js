import * as d3 from "d3";

// Define utility functions inline to avoid import issues
const z_score = (data, z) => z * d3.deviation(data) + d3.mean(data);
const outlier_value = (data, z) => z_score(data, z);

export default function Info({ data, z }) {
  if (!data || data.length === 0) {
    console.error("No data provided to Info component");
    return document.createElement("div"); // Return empty div if no data
  }

  console.log("Info - Data received:", data);
  console.log("Info - Z value:", z);

  const days = d3.sort(data.map(d => d.days));
  const ov = outlier_value(days, z);
  const index = d3.bisect(days, ov);
  const oc = days.length - index;

  const element = document.createElement("div");
  element.textContent = oc ? `There are ${oc} outliers with a mean of ${d3.mean(days.slice(index)).toFixed(2)}.` : '';
  return element;
}
