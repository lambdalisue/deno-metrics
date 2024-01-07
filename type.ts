/**
 * OpenMetrics types
 *
 * https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md#protobuf-schema
 *
 * @module
 */
export interface MetricSet {
  metricFamilies: MetricFamily[];
}

export interface MetricFamily {
  name: string;
  type?: MetricType;
  unit?: string;
  help?: string;
  metrics: Metric[];
}

export type MetricType =
  | "unknown"
  | "gauge"
  | "counter"
  | "histogram"
  | "stateset"
  | "info"
  | "summary";

export interface Metric {
  labels: Record<string, string>;
  metricPoints: MetricPoint[];
}

export interface MetricPoint {
  value: MetricValue;
  timestamp?: number;
}

export type MetricValue =
  | UnknownValue
  | GaugeValue
  | CounterValue
  | HistogramValue
  | StateSetValue
  | InfoValue
  | SummaryValue;

export interface UnknownValue {
  value: number;
}

export interface GaugeValue {
  value: number;
}

export interface CounterValue {
  total: number;
  created?: number;
  examplar?: Examplar;
}

export interface HistogramValue {
  sum?: number;
  count?: number;
  created?: number;
  buckets?: {
    count: number;
    upperBound?: number;
    examplar?: Examplar;
  }[];
}

export interface Examplar {
  value: number;
  timestamp?: number;
  label: Record<string, string>;
}

export interface StateSetValue {
  states: {
    enabled: boolean;
    name: string;
  }[];
}

export interface InfoValue {
  info: Record<string, string>;
}

export interface SummaryValue {
  sum?: number;
  count?: number;
  created?: number;
  quantile: {
    quantile: number;
    value: number;
  }[];
}
