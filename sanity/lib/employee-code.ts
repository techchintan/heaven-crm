/**
 * Heaven Pro employee ID: HPS (company) + E (employee) + sequence.
 * Examples: HPSE01, HPSE02, … HPSE99, HPSE100
 */
export const EMPLOYEE_CODE_PREFIX = "HPSE";

const EMPLOYEE_CODE_REGEX = /^HPSE(\d+)$/i;

export function formatEmployeeCode(sequence: number): string {
  if (!Number.isFinite(sequence) || sequence < 1) {
    throw new Error("Employee sequence must be a positive integer");
  }
  const digits = sequence >= 100 ? String(sequence) : String(sequence).padStart(2, "0");
  return `${EMPLOYEE_CODE_PREFIX}${digits}`;
}

export function parseEmployeeCodeSequence(code: string): number | null {
  const match = code.trim().toUpperCase().match(EMPLOYEE_CODE_REGEX);
  if (!match) return null;
  const sequence = Number.parseInt(match[1], 10);
  return Number.isFinite(sequence) ? sequence : null;
}

export function isValidEmployeeCode(code: string): boolean {
  return parseEmployeeCodeSequence(code) != null;
}

/** Next sequence after the highest existing HPSE code (or 1 if none). */
export function getNextEmployeeSequence(existingCodes: string[]): number {
  let max = 0;
  for (const code of existingCodes) {
    const sequence = parseEmployeeCodeSequence(code);
    if (sequence != null && sequence > max) {
      max = sequence;
    }
  }
  return max + 1;
}

/** Prefer draft value, then fall back to published (read-only fields may be missing on draft). */
export function resolveEmployeeCode(
  draft: Record<string, unknown> | null | undefined,
  published: Record<string, unknown> | null | undefined,
): string {
  const draftCode =
    typeof draft?.employeeCode === "string" ? draft.employeeCode.trim().toUpperCase() : "";
  if (draftCode) return draftCode;

  const publishedCode =
    typeof published?.employeeCode === "string" ? published.employeeCode.trim().toUpperCase() : "";
  return publishedCode;
}
