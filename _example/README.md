# example

1. Run `docker compose up -d` to start [Prometheus] containers.
2. Run `deno run -a ./main.ts` to start the example server.
3. Access http://localhost:9090/targets to see if the `host` metrics is scraped.

[Prometheus]: https://prometheus.io
