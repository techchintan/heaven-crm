import {formatCurrency, formatDate} from "@/lib/format";

/** Join non-empty preview subtitle segments with a middle dot. */
export function previewSubtitle(...parts: (string | null | undefined | false)[]): string {
  return parts.filter((p) => p != null && String(p).trim() !== "").join(" · ");
}

export function previewInr(value: number | null | undefined): string | undefined {
  if (value == null || Number.isNaN(Number(value))) return undefined;
  return formatCurrency(Number(value));
}

export function previewDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const formatted = formatDate(value);
  return formatted === "Invalid date" ? undefined : formatted;
}

export const candidateStatusLabels: Record<string, string> = {
  immediately_available: "Immediately available",
  available_next_30_days: "Available in 30 days",
  on_notice_period: "On notice",
  not_available: "Not available",
  on_hold: "On hold",
  placed: "Placed",
};

export const candidateStatusEmoji: Record<string, string> = {
  immediately_available: "🟢",
  available_next_30_days: "🟡",
  on_notice_period: "🟠",
  on_hold: "⚪",
  not_available: "⚫",
  placed: "✅",
};

export const vendorStatusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  prospect: "Prospect",
  in_progress: "In progress",
  on_hold: "On hold",
};

export const vendorStatusEmoji: Record<string, string> = {
  active: "🟢",
  inactive: "⚫",
  prospect: "🔵",
  in_progress: "🟡",
  on_hold: "🟠",
};

export const industryLabels: Record<string, string> = {
  it_software: "IT & Software",
  banking_finance: "Banking & Finance",
  healthcare: "Healthcare",
  manufacturing: "Manufacturing",
  ecommerce: "E-commerce",
  consulting: "Consulting",
  education: "Education",
  telecom: "Telecom",
  retail: "Retail",
  other: "Other",
};

export const revenueStatusLabels: Record<string, string> = {
  pending: "Pending",
  invoiced: "Invoiced",
  paid: "Paid",
  deducted: "Deducted",
  partially_paid: "Partially paid",
};

export const revenueStatusEmoji: Record<string, string> = {
  pending: "⏳",
  invoiced: "📄",
  paid: "✅",
  deducted: "❌",
  partially_paid: "⚠️",
};

export const engagementTypeLabels: Record<string, string> = {
  permanent: "Permanent",
  contract: "Contract",
  contract_to_hire: "Contract-to-hire",
  temporary: "Temporary",
};

export const teamRoleLabels: Record<string, string> = {
  trainee: "Trainee",
  recruiter: "Recruiter",
  senior_recruiter: "Senior Recruiter",
  team_lead: "Team Lead",
  manager: "Manager",
  founder_ceo: "Founder & CEO",
};

export const workStatusLabels: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  intern: "Intern",
};

export const leadSourceLabels: Record<string, string> = {
  inbound: "Inbound",
  referral: "Referral",
  outbound: "Outbound",
  job_board: "Job board",
  event: "Event",
  expansion: "Expansion",
  other: "Other",
};

export const candidateSourceLabels: Record<string, string> = {
  linkedin: "LinkedIn",
  naukri: "Naukri",
  referral: "Referral",
  job_portal: "Job portal",
  direct: "Direct",
  other: "Other",
};

export const feeModelLabels: Record<string, string> = {
  percent_ctc: "% of CTC",
  flat_per_hire: "Flat per hire",
};

export function labeled(
  value: string | undefined | null,
  labels: Record<string, string>,
  fallback = "—",
): string {
  if (!value) return fallback;
  return labels[value] ?? value;
}

export function withEmoji(
  value: string | undefined | null,
  labels: Record<string, string>,
  emojis: Record<string, string>,
): string {
  if (!value) return "—";
  const emoji = emojis[value] ?? "";
  const label = labels[value] ?? value;
  return emoji ? `${emoji} ${label}` : label;
}
