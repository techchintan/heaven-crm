import {defineField, defineType} from "sanity";

import {
  engagementTypeLabels,
  labeled,
  previewDate,
  previewInr,
  previewSubtitle,
  revenueStatusEmoji,
  revenueStatusLabels,
  withEmoji,
} from "../lib/preview";
import {placementTypeIcon} from "../lib/studio-icons";

export const placement = defineType({
  name: "placement",
  title: "Placement",
  type: "document",
  icon: placementTypeIcon,
  fieldsets: [
    {
      name: "parties",
      title: "Who Was Placed",
      description: "Candidate, vendor, and recruiter for this placement",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "role",
      title: "Role & Engagement",
      description: "Position, employment type, and work location",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "timeline",
      title: "Timeline",
      description: "Key dates from offer through probation and billing",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "financials",
      title: "Fee Inputs",
      description: "Salary and fee settings used to calculate the invoice",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "calculated",
      title: "Invoice Totals",
      description: "Auto-calculated from fee inputs (read-only)",
      options: {collapsible: true, collapsed: true},
    },
    {
      name: "billing",
      title: "Billing & Collection",
      description: "Revenue status, invoice reference, and payment received",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "meta",
      title: "Record Info",
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    // — Who Was Placed —
    defineField({
      name: "candidate",
      title: "Candidate",
      type: "reference",
      to: [{type: "candidate"}],
      fieldset: "parties",
      description: "The candidate who was placed with the vendor",
      validation: (Rule) => Rule.required().error("Candidate is required"),
    }),
    defineField({
      name: "vendor",
      title: "Vendor",
      type: "reference",
      to: [{type: "vendor"}],
      fieldset: "parties",
      description: "The hiring company for this placement",
      validation: (Rule) => Rule.required().error("Vendor is required"),
    }),
    defineField({
      name: "recruiter",
      title: "Recruiter",
      type: "reference",
      to: [{type: "teamMember"}],
      fieldset: "parties",
      description: "Team member who closed this placement",
      options: {
        filter: '_type == "teamMember" && isActive == true',
      },
      validation: (Rule) => Rule.required().error("Recruiter is required"),
    }),

    // — Role & Engagement —
    defineField({
      name: "jobTitle",
      title: "Job Title",
      type: "string",
      fieldset: "role",
      description: "Role or designation the candidate was hired for",
      validation: (Rule) => Rule.required().error("Job title is required"),
    }),
    defineField({
      name: "engagementType",
      title: "Engagement Type",
      type: "string",
      fieldset: "role",
      description: "Employment arrangement with the vendor",
      options: {
        list: [
          {title: "Permanent", value: "permanent"},
          {title: "Contract", value: "contract"},
          {title: "Contract-to-hire", value: "contract_to_hire"},
          {title: "Temporary / Staffing", value: "temporary"},
        ],
        layout: "radio",
      },
      initialValue: "permanent",
    }),
    defineField({
      name: "workArrangement",
      title: "Work Arrangement",
      type: "string",
      fieldset: "role",
      description: "On-site, hybrid, remote, or flexible working model",
      options: {
        list: [
          {title: "On-site", value: "onsite"},
          {title: "Hybrid", value: "hybrid"},
          {title: "Remote", value: "remote"},
          {title: "Flexible", value: "flexible"},
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "workLocation",
      title: "Work Location",
      type: "string",
      fieldset: "role",
      description: 'City or region, e.g. "Bangalore" or "Remote — India"',
    }),
    defineField({
      name: "vendorReference",
      title: "Vendor PO / Job Reference",
      type: "string",
      fieldset: "role",
      description: "Purchase order, job code, or internal vendor reference for billing",
    }),

    // — Timeline (chronological) —
    defineField({
      name: "offerAcceptedDate",
      title: "Offer Accepted Date",
      type: "date",
      fieldset: "timeline",
      description: "When the candidate accepted the offer (optional)",
      options: {dateFormat: "DD/MM/YYYY"},
      validation: (Rule) =>
        Rule.custom((offerDate, context) => {
          if (!offerDate) return true;
          const parent = context.parent as {placementDate?: string};
          const placementDate = parent?.placementDate;
          if (!placementDate) return true;
          return offerDate <= placementDate
            ? true
            : "Offer date should be on or before placement (joining) date";
        }),
    }),
    defineField({
      name: "placementDate",
      title: "Placement / Joining Date",
      type: "date",
      fieldset: "timeline",
      description: "Date the candidate joined — drives probation and invoicing",
      options: {dateFormat: "DD/MM/YYYY"},
      validation: (Rule) => Rule.required().error("Placement date is required"),
    }),
    defineField({
      name: "probationPeriodDays",
      title: "Probation Period (Days)",
      type: "number",
      fieldset: "timeline",
      description: "Length of probation for early-exit rules. Defaults to 90 days if empty.",
      initialValue: 90,
      validation: (Rule) => Rule.min(1).max(365).integer(),
    }),
    defineField({
      name: "probationEndDate",
      title: "Probation End Date",
      type: "date",
      fieldset: "timeline",
      description: "Placement date + probation period (auto-calculated)",
      options: {dateFormat: "DD/MM/YYYY"},
      readOnly: true,
    }),
    defineField({
      name: "exitDate",
      title: "Exit Date",
      type: "date",
      fieldset: "timeline",
      description:
        "If the candidate left early, set this date. May trigger fee deduction before probation ends.",
      options: {dateFormat: "DD/MM/YYYY"},
      validation: (Rule) =>
        Rule.custom((exitDate, context) => {
          const parent = context.parent as {placementDate?: string};
          if (!exitDate || !parent?.placementDate) return true;
          const exit = new Date(exitDate);
          const placement = new Date(parent.placementDate);
          return exit >= placement ? true : "Exit date must be on or after placement date";
        }),
    }),
    defineField({
      name: "invoiceDate",
      title: "Invoice Date",
      type: "date",
      fieldset: "timeline",
      description: "1st of the month following placement (auto-calculated)",
      options: {dateFormat: "DD/MM/YYYY"},
      readOnly: true,
    }),
    defineField({
      name: "paymentDueDate",
      title: "Payment Due Date",
      type: "date",
      fieldset: "timeline",
      description: "Expected payment date from vendor payment terms (auto-calculated)",
      options: {dateFormat: "DD/MM/YYYY"},
      readOnly: true,
    }),

    // — Fee Inputs —
    defineField({
      name: "baseSalary",
      title: "Base Salary (INR per annum)",
      type: "number",
      fieldset: "financials",
      description: "Annual CTC offered to the candidate in Indian Rupees",
      validation: (Rule) => Rule.required().min(1).error("Base salary must be a positive number"),
    }),
    defineField({
      name: "feeMode",
      title: "Fee Type",
      type: "string",
      fieldset: "financials",
      description: "Charge as a percentage of annual CTC or a fixed flat fee",
      options: {
        list: [
          {title: "% of annual CTC", value: "percentage"},
          {title: "Flat fee (fixed INR)", value: "flat"},
        ],
        layout: "radio",
      },
      initialValue: "percentage",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "feePercentage",
      title: "Fee Percentage (%)",
      type: "number",
      fieldset: "financials",
      description: "Recruitment fee as % of annual CTC (typically 8.33%)",
      initialValue: 8.33,
      hidden: ({parent}) => (parent as {feeMode?: string}).feeMode === "flat",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mode = (context.parent as {feeMode?: string}).feeMode ?? "percentage";
          if (mode === "flat") return true;
          if (value == null || Number.isNaN(Number(value))) {
            return "Fee percentage is required";
          }
          const n = Number(value);
          if (n < 0.01 || n > 100) {
            return "Fee percentage must be between 0.01 and 100";
          }
          return true;
        }),
    }),
    defineField({
      name: "flatFeeAmount",
      title: "Flat Fee (INR)",
      type: "number",
      fieldset: "financials",
      description: "Fixed recruitment fee amount before GST",
      hidden: ({parent}) => (parent as {feeMode?: string}).feeMode !== "flat",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mode = (context.parent as {feeMode?: string}).feeMode ?? "percentage";
          if (mode !== "flat") return true;
          if (value == null || Number.isNaN(Number(value))) {
            return "Flat fee amount is required";
          }
          const n = Number(value);
          if (n < 1) {
            return "Flat fee must be at least ₹1";
          }
          return true;
        }),
    }),
    defineField({
      name: "gstPercentage",
      title: "GST Percentage (%)",
      type: "number",
      fieldset: "financials",
      description: "GST rate applied to the fee (fixed at 18%)",
      initialValue: 18,
      readOnly: true,
    }),

    // — Invoice Totals (read-only) —
    defineField({
      name: "feeAmount",
      title: "Fee Amount (INR)",
      type: "number",
      fieldset: "calculated",
      description: "Base salary × fee %, or flat fee amount, before GST (auto-calculated)",
      readOnly: true,
    }),
    defineField({
      name: "gstAmount",
      title: "GST Amount (INR)",
      type: "number",
      fieldset: "calculated",
      description: "Fee amount × GST % (auto-calculated)",
      readOnly: true,
    }),
    defineField({
      name: "totalInvoiceValue",
      title: "Total Invoice Value (INR)",
      type: "number",
      fieldset: "calculated",
      description: "Fee amount + GST (auto-calculated)",
      readOnly: true,
    }),

    // — Billing & Collection —
    defineField({
      name: "revenueStatus",
      title: "Revenue Status",
      type: "string",
      fieldset: "billing",
      description: "Billing and collection status for this placement",
      options: {
        list: [
          {title: "Pending", value: "pending"},
          {title: "Invoiced", value: "invoiced"},
          {title: "Paid", value: "paid"},
          {title: "Deducted (Early Exit)", value: "deducted"},
          {title: "Partially Paid", value: "partially_paid"},
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    defineField({
      name: "invoiceNumber",
      title: "Invoice Number",
      type: "string",
      fieldset: "billing",
      description: "Your invoice or reference number sent to the vendor",
    }),
    defineField({
      name: "paymentDate",
      title: "Payment Received Date",
      type: "date",
      fieldset: "billing",
      description: "Date payment was received from the vendor",
      options: {dateFormat: "DD/MM/YYYY"},
    }),
    defineField({
      name: "amountReceived",
      title: "Amount Received (INR)",
      type: "number",
      fieldset: "billing",
      description: "Actual amount received (may be less than invoice after deductions)",
      validation: (Rule) => Rule.min(0).error("Amount must be positive"),
    }),

    // — Notes & metadata —
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      description: "Private notes about this placement (not shared with vendors)",
      rows: 4,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      fieldset: "meta",
      description: "When this placement record was first created",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      candidateName: "candidate.fullName",
      vendorName: "vendor.companyName",
      recruiterName: "recruiter.name",
      jobTitle: "jobTitle",
      placementDate: "placementDate",
      status: "revenueStatus",
      totalInvoice: "totalInvoiceValue",
      engagementType: "engagementType",
      invoiceNumber: "invoiceNumber",
    },
    prepare({
      candidateName,
      vendorName,
      recruiterName,
      jobTitle,
      placementDate,
      status,
      totalInvoice,
      engagementType,
      invoiceNumber,
    }) {
      const parties = `${candidateName || "Candidate"} → ${vendorName || "Vendor"}`;
      const title = jobTitle ? `${parties} · ${jobTitle}` : parties;

      return {
        title,
        subtitle: previewSubtitle(
          previewDate(placementDate),
          previewInr(totalInvoice),
          withEmoji(status, revenueStatusLabels, revenueStatusEmoji),
          invoiceNumber && `Inv #${invoiceNumber}`,
          recruiterName && `Recruiter: ${recruiterName}`,
          labeled(engagementType, engagementTypeLabels),
        ),
      };
    },
  },
  orderings: [
    {
      title: "Placement Date (Newest)",
      name: "placementDateDesc",
      by: [{field: "placementDate", direction: "desc"}],
    },
    {
      title: "Placement Date (Oldest)",
      name: "placementDateAsc",
      by: [{field: "placementDate", direction: "asc"}],
    },
    {
      title: "Invoice Value (High to Low)",
      name: "totalInvoiceDesc",
      by: [{field: "totalInvoiceValue", direction: "desc"}],
    },
    {
      title: "Recently Created",
      name: "createdAtDesc",
      by: [{field: "createdAt", direction: "desc"}],
    },
  ],
});
