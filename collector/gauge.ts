import type { GaugeValue } from "../type.ts";
import { MetricCollector, MetricCollectorOptions } from "../collector.ts";

class GaugeRetriever {
  #value = 0;
  #now: () => number;

  constructor(now: () => number) {
    this.#now = now;
  }

  retrieve(): GaugeValue {
    return { value: this.#value };
  }

  inc(v = 1): void {
    this.#value += v;
  }

  dec(v = 1): void {
    this.#value -= v;
  }

  set(v: number): void {
    this.#value = v;
  }

  setToCurrentTime(): void {
    this.#value = this.#now();
  }
}

export class Gauge<V extends string[]>
  extends MetricCollector<GaugeRetriever, V> {
  constructor(options: MetricCollectorOptions<V>) {
    const now = options.now ?? MetricCollector.now;
    super("gauge", () => new GaugeRetriever(now), options);
  }

  inc(v = 1): void {
    this.with({}).inc(v);
  }

  dec(v = 1): void {
    this.with({}).dec(v);
  }

  set(v: number): void {
    this.with({}).set(v);
  }

  setToCurrentTime(): void {
    this.with({}).setToCurrentTime();
  }
}
