import * as metrics from "../mod.ts";

function buildMetrics(registry: metrics.Registry) {
  const m = {
    cpuTemp: new metrics.Gauge({
      name: "cpu_temperature_celsius",
      help: "Current temperature of the CPU.",
    }),
    hdFailures: new metrics.Counter({
      name: "hd_errors_total",
      help: "Number of hard-disk errors.",
      variableLabels: ["device"],
    }),
  };
  registry.register(m.cpuTemp);
  registry.register(m.hdFailures);
  return m;
}

function main(): void {
  const registry = new metrics.Registry();
  const m = buildMetrics(registry);
  m.cpuTemp.set(65.3);
  m.hdFailures.with({ device: "/dev/sda" }).inc();
  const exporter = new metrics.PrometheusExporter(registry);
  exporter.serve({
    hostname: "127.0.0.1",
    port: 9000,
  });
}

if (import.meta.main) {
  main();
}
