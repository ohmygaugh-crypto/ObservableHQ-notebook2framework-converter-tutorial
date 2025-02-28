import * as d3 from "d3";

export const z_score = (data, z) => z * d3.deviation(data) + d3.mean(data);
export const outlier_value = (data, z) => z_score(data, z); 