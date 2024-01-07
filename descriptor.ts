import { validateLabelName } from "./label.ts";

// https://github.com/microsoft/TypeScript/issues/47756#issuecomment-1031292619
type Cast<A, B> = A extends B ? A : B;
type Narrow<A> = Cast<A, { [K in keyof A]: Narrow<A[K]> }>;

export type Labels<V extends string[]> = V extends never[] ? never
  : Record<V[number], string>;

export type DescriptorOptions<V extends string[]> = Narrow<{
  name: string;
  help?: string;
  variableLabels?: V;
  constLabels?: Record<string, string>;
}>;

export class Descriptor<V extends string[]> {
  readonly name: string;
  readonly help: string;
  readonly variableLabels: Labels<V>;
  readonly constLabels: Labels<string[]>;

  constructor(options: DescriptorOptions<V>) {
    this.name = options.name;
    this.help = options.help ?? "";
    this.variableLabels = Object.fromEntries(
      (options.variableLabels ?? []).map((k) => [k, ""]),
    ) as Labels<V>;
    this.constLabels = options.constLabels ?? {};
    // Validate label names
    Object.keys(this.variableLabels).forEach(validateLabelName);
    Object.keys(this.constLabels).forEach(validateLabelName);
  }
}
