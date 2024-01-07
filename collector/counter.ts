import type { CounterValue } from "../type.ts";
import { MetricCollector, MetricCollectorOptions } from "../collector.ts";

class CounterRetriever {
  #total = 0;
  #created: number;

  constructor(created: number) {
    this.#created = created;
  }

  retrieve(): CounterValue {
    return { total: this.#total, created: this.#created };
  }

  inc(v = 1): void {
    this.#total += v;
  }
}

export class Counter<V extends string[]>
  extends MetricCollector<CounterRetriever, V> {
  constructor(options: MetricCollectorOptions<V>) {
    const created = (options.now ?? MetricCollector.now)();
    super("counter", () => new CounterRetriever(created), options);
  }

  inc(v = 1): void {
    this.with({}).inc(v);
  }
}
