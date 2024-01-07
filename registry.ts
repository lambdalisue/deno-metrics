import type { MetricSet } from "./type.ts";
import type { Collector } from "./collector.ts";

export class Registry {
  #collectors: Collector[] = [];

  register(collector: Collector): void {
    if (this.#collectors.find((c) => c.name === collector.name)) {
      throw new Error(`Collector ${collector.name} already registered`);
    }
    this.#collectors.push(collector);
  }

  unregister(collector: Collector): void {
    const index = this.#collectors.findIndex((c) => c.name === collector.name);
    if (index === -1) {
      throw new Error(`Collector ${collector.name} is not registered`);
    }
    this.#collectors.splice(index);
  }

  async gather(): Promise<MetricSet> {
    const metricFamiliesSet = await Promise.all(
      this.#collectors.flatMap((c) => c.collect()),
    );
    const metricFamilies = metricFamiliesSet.flat();
    return { metricFamilies };
  }
}
