// label-name = label-name-initial-char *label-name-char
// label-name-char = label-name-initial-char / DIGIT
// label-name-initial-char = ALPHA / "_"
// https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md#abnf
const LABEL_NAME_PATTERN = /^[a-zA-Z_][a-zA-Z0-9]*$/;

export function serializeLabels(labels: Record<string, string>): string {
  if (!labels) {
    return "";
  }
  const normalized = Object.entries(labels)
    .toSorted(([k1], [k2]) => k1.localeCompare(k2))
    .filter(([_, v]) => v !== "");
  return JSON.stringify(normalized);
}

export function deserializeLabels(s: string): Record<string, string> {
  if (!s) {
    return {};
  }
  return Object.fromEntries(JSON.parse(s));
}

export function validateLabelName(name: string): void {
  if (!LABEL_NAME_PATTERN.test(name)) {
    throw new Error(
      "label name must match /^[a-zA-Z_][a-zA-Z0-9]*$/",
    );
  }
}
