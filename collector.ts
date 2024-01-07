import type { Metric, MetricFamily, MetricType, MetricValue } from "./type.ts";
import { Descriptor, DescriptorOptions, Labels } from "./descriptor.ts";
import { deserializeLabels, serializeLabels } from "./label.ts";

export interface Collector {
  readonly name: string;
  collect(): Promise<MetricFamily[]>;
}

export type MetricCollectorOptions<V extends string[]> =
  & DescriptorOptions<V>
  & {
    now?: () => number;
  };

interface MetricRetriever {
  retrieve(): MetricValue;
}

type Factory<R extends MetricRetriever> = () => R;

export class MetricCollector<R extends MetricRetriever, V extends string[]>
  implements Collector {
  #retrievers: Map<string, R> = new Map();
  #metricType: MetricType;
  #factory: Factory<R>;
  #descriptor: Descriptor<V>;
  #now: () => number;

  constructor(
    metricType: MetricType,
    factory: Factory<R>,
    options: MetricCollectorOptions<V>,
  ) {
    this.#metricType = metricType;
    this.#factory = factory;
    this.#descriptor = new Descriptor(options);
    this.#now = options.now ?? MetricCollector.now;
  }

  static now(): number {
    return Date.now();
  }

  get name(): string {
    return this.#descriptor.name;
  }

  collect(): Promise<MetricFamily[]> {
    const timestamp = this.#now();
    const metrics: Metric[] = [...this.#retrievers.entries()].map(([k, v]) => {
      const labels = {
        ...deserializeLabels(k),
        ...this.#descriptor.constLabels,
      };
      return {
        labels,
        metricPoints: [{
          value: v.retrieve(),
          timestamp,
        }],
      };
    });
    return Promise.resolve([{
      name: this.#descriptor.name,
      type: this.#metricType,
      help: this.#descriptor.help,
      metrics,
    }]);
  }

  with(labels: Partial<Labels<V>>): R {
    const key = serializeLabels({
      ...this.#descriptor.variableLabels,
      ...labels,
    });
    let retriever = this.#retrievers.get(key);
    if (!retriever) {
      retriever = this.#factory();
      this.#retrievers.set(key, retriever);
    }
    return retriever;
  }
}
