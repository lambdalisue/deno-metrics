# deno-openmetrics

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/openmetrics)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/prometheus/mod.ts)
[![Test](https://github.com/lambdalisue/deno-openmetrics/workflows/Test/badge.svg)](https://github.com/lambdalisue/deno-openmetrics/actions?query=workflow%3ATest)

OpenMetrics library for [Deno]. It supports exporting metrics to [Prometheus]
and [OpenMetrics].

[Deno]: https://deno.land/
[Prometheus]: https://prometheus.io/
[OpenMetrics]: https://openmetrics.io/

## ToDo

- [ ] Support Metric Types
  - [ ] `StateSet`
  - [ ] `Info`
  - [ ] `Histogram`
  - [ ] `GaugeHistogram`
  - [ ] `Summary`
  - [ ] `Unknown`
- [ ] Add a `Collector` that use `Deno.metrics()` to collect metrics
- [ ] Consider if we can use `Worker` to collect/handle metrics in background

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
