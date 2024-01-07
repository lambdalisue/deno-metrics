import type { MetricSet } from "../type.ts";
import type { Formatter } from "../formatter.ts";
import { PrometheusFormatter } from "./prometheus.ts";

export class OpenMetricsFormatter implements Formatter {
  #inner = new PrometheusFormatter();

  format(metricSet: MetricSet): string {
    const content = this.#inner.format(metricSet).replace(/\n\n/g, "\n");
    return `${content}\n# EOF\n`;
  }
}
