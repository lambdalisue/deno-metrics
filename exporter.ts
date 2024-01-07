import { Registry } from "./registry.ts";

export interface Exporter {
  serve(options: Deno.ServeOptions | Deno.ServeTlsOptions): void;
}

export interface ExporterConstructor<T extends Exporter> {
  new (registry: Registry): T;
}
