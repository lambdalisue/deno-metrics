import type { MetricSet } from "./type.ts";

export interface Formatter {
  format(metricSet: MetricSet): string;
}
