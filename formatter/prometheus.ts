import type {
  CounterValue,
  GaugeValue,
  Metric,
  MetricFamily,
  MetricSet,
  MetricType,
} from "../type.ts";
import type { Formatter } from "../formatter.ts";
import { unimplemented } from "https://deno.land/x/errorutil@v0.1.1/mod.ts";

export class PrometheusFormatter implements Formatter {
  format(metricSet: MetricSet): string {
    const { metricFamilies } = metricSet;
    const metricFamilyLines = metricFamilies.map(formatMetricFamily);
    const content = metricFamilyLines.join("\n\n");
    return content;
  }
}

function formatMetricFamily(metricFamily: MetricFamily): string {
  const lines: string[] = [];
  if (metricFamily.help) {
    lines.push(`# HELP ${metricFamily.name} ${metricFamily.help}`);
  }
  if (metricFamily.type) {
    lines.push(`# TYPE ${metricFamily.name} ${metricFamily.type}`);
  }
  const metricFormatter = getMetricFormatter(metricFamily.type);
  lines.push(
    ...metricFamily.metrics.map((metric) =>
      metricFormatter(metricFamily.name, metric)
    ),
  );
  return lines.join("\n");
}

function formatLabels(labels: Record<string, string>): string {
  const inner = Object.entries(labels)
    .filter(([_, v]) => v !== "")
    .map(([k, v]) => `${k}="${v}"`)
    .join(",");
  return inner ? `{${inner}}` : "";
}

function getMetricFormatter(
  type?: MetricType,
): (name: string, metric: Metric) => string {
  switch (type) {
    case "gauge":
      return formatGaugeMetric;
    case "counter":
      return formatCounterMetric;
    default:
      unimplemented();
  }
}

function formatGaugeMetric(name: string, metric: Metric): string {
  const labels = formatLabels(metric.labels);
  const lines = metric.metricPoints.map((point) => {
    const value: GaugeValue = point.value as GaugeValue;
    return `${name}${labels} ${value.value} ${point.timestamp ?? ""}`;
  });
  return lines.join("\n");
}

function formatCounterMetric(name: string, metric: Metric): string {
  const labels = formatLabels(metric.labels);
  const lines = metric.metricPoints.flatMap((point) => {
    const value: CounterValue = point.value as CounterValue;
    if (value.created) {
      return [
        `${name}_total${labels} ${value.total} ${point.timestamp ?? ""}`,
        `${name}_created${labels} ${value.created} ${point.timestamp ?? ""}`,
      ];
    }
    return [
      `${name}_total${labels} ${value.total} ${point.timestamp ?? ""}`,
    ];
  });
  return lines.join("\n");
}
