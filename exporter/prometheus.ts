import { Registry } from "../registry.ts";
import { PrometheusFormatter } from "../formatter/prometheus.ts";

export class PrometheusExporter {
  #formatter = new PrometheusFormatter();
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
      "text/plain; version=0.0.4",
    );
    return new Response(content, {
      status: 200,
      headers,
    });
  }
}
