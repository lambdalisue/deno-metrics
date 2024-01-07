import { Registry } from "../registry.ts";
import { OpenMetricsFormatter } from "../formatter/openmetrics.ts";

// NOTE:
// This exporter is not tested yet.
export class OpenMetricsExporter {
  #formatter = new OpenMetricsFormatter();
  #registry: Registry;

  constructor(registry: Registry) {
    this.#registry = registry;
  }

  serve(
    options: Deno.ServeOptions | Deno.ServeTlsOptions = {
      hostname: "127.0.0.1",
      port: 9000,
    },
  ): void {
    Deno.serve(options, (request) => this.#handler(request));
  }

  // https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md#overall-structure
  async #handler(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/metrics") {
      return new Response("Not found", { status: 404 });
    }
    const metricSet = await this.#registry.gather();
    const content = this.#formatter.format(metricSet);
    const headers = new Headers();
    headers.set(
      "Content-Type",
      "application/openmetrics-text; version=1.0.0; charset=utf-8",
    );
    return new Response(content, {
      status: 200,
      headers,
    });
  }
}
