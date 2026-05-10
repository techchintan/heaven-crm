import {defineField, defineType} from "sanity";
import {DocumentsIcon} from "@sanity/icons";

export const placement = defineType({
  name: "placement",
  title: "Placement",
  type: "document",
  icon: DocumentsIcon,
  fieldsets: [
    {
      name: "references",
      title: "Placement Details",
      description: "Link the candidate, client, and recruiter",
    },
    {
      name: "financials",
      title: "Financial Information",
      description: "Salary and fee calculations",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "calculated",
      title: "Calculated Values (Auto-computed)",
      description: "These fields are automatically calculated based on inputs above",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "dates",
      title: "Important Dates",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "status",
      title: "Status & Payment",
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    // === REFERENCES ===
    defineField({
      name: "candidate",
      title: "Candidate",
      type: "reference",
      to: [{type: "candidate"}],
      fieldset: "references",
      description: "The placed candidate",
      validation: (Rule) => Rule.required().error("Candidate is required"),
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "reference",
      to: [{type: "client"}],
      fieldset: "references",
      description: "The hiring company",
      validation: (Rule) => Rule.required().error("Client is required"),
    }),
    defineField({
      name: "recruiter",
      title: "Recruiter",
      type: "reference",
      to: [{type: "teamMember"}],
      fieldset: "references",
      description: "The recruiter who made this placement",
      validation: (Rule) => Rule.required().error("Recruiter is required"),
    }),
    defineField({
      name: "jobTitle",
      title: "Job Title",
      type: "string",
      fieldset: "references",
      description: "Position the candidate was hired for",
      validation: (Rule) => Rule.required().error("Job title is required"),
    }),

    // === FINANCIALS (User Inputs) ===
    defineField({
      name: "baseSalary",
      title: "Base Salary (INR per annum)",
      type: "number",
      fieldset: "financials",
      description: "Annual salary offered to the candidate in Indian Rupees",
      validation: (Rule) => Rule.required().min(1).error("Base salary must be a positive number"),
    }),
    defineField({
      name: "feePercentage",
      title: "Fee Percentage (%)",
      type: "number",
      fieldset: "financials",
      description: "Recruitment fee percentage (typically 8.33%)",
      initialValue: 8.33,
      validation: (Rule) =>
        Rule.required().min(0.01).max(100).error("Fee percentage must be between 0.01 and 100"),
    }),
    defineField({
      name: "gstPercentage",
      title: "GST Percentage (%)",
      type: "number",
      fieldset: "financials",
      description: "GST rate (fixed at 18%)",
      initialValue: 18,
      readOnly: true,
    }),

    // === CALCULATED FIELDS ===
    defineField({
      name: "feeAmount",
      title: "Fee Amount (INR)",
      type: "number",
      fieldset: "calculated",
      description: "Calculated: Base Salary × (Fee % ÷ 100)",
      readOnly: true,
    }),
    defineField({
      name: "gstAmount",
      title: "GST Amount (INR)",
      type: "number",
      fieldset: "calculated",
      description: "Calculated: Fee Amount × 18%",
      readOnly: true,
    }),
    defineField({
      name: "totalInvoiceValue",
      title: "Total Invoice Value (INR)",
      type: "number",
      fieldset: "calculated",
      description: "Calculated: Fee Amount + GST Amount",
      readOnly: true,
    }),

    // === DATES ===
    defineField({
      name: "placementDate",
      title: "Placement Date",
      type: "date",
      fieldset: "dates",
      description: "Date when candidate joined the client",
      options: {
        dateFormat: "DD/MM/YYYY",
      },
      validation: (Rule) => Rule.required().error("Placement date is required"),
    }),
    defineField({
      name: "probationEndDate",
      title: "Probation End Date",
      type: "date",
      fieldset: "dates",
      description: "Auto-calculated: Placement Date + 90 days",
      options: {
        dateFormat: "DD/MM/YYYY",
      },
      readOnly: true,
    }),
    defineField({
      name: "invoiceDate",
      title: "Invoice Date",
      type: "date",
      fieldset: "dates",
      description: "Auto-calculated: 1st of the month following placement",
      options: {
        dateFormat: "DD/MM/YYYY",
      },
      readOnly: true,
    }),
    defineField({
      name: "exitDate",
      title: "Exit Date",
      type: "date",
      fieldset: "dates",
      description:
        "Date when candidate left (if applicable). Triggers deduction if before probation end.",
      options: {
        dateFormat: "DD/MM/YYYY",
      },
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
      name: "paymentDueDate",
      title: "Payment Due Date",
      type: "date",
      fieldset: "dates",
      description: "When payment is expected (based on client payment terms)",
      options: {
        dateFormat: "DD/MM/YYYY",
      },
      readOnly: true,
    }),

    // === STATUS & PAYMENT ===
    defineField({
      name: "revenueStatus",
      title: "Revenue Status",
      type: "string",
      fieldset: "status",
      description: "Current status of this placement's revenue",
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
      fieldset: "status",
      description: "Invoice reference number",
    }),
    defineField({
      name: "paymentDate",
      title: "Payment Received Date",
      type: "date",
      fieldset: "status",
      description: "Date when payment was received",
      options: {
        dateFormat: "DD/MM/YYYY",
      },
    }),
    defineField({
      name: "amountReceived",
      title: "Amount Received (INR)",
      type: "number",
      fieldset: "status",
      description: "Actual amount received (may differ from invoice if deducted)",
      validation: (Rule) => Rule.min(0).error("Amount must be positive"),
    }),

    // === META ===
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      description: "Private notes about this placement",
      rows: 4,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      candidateName: "candidate.fullName",
      clientName: "client.companyName",
      placementDate: "placementDate",
      status: "revenueStatus",
      totalInvoice: "totalInvoiceValue",
    },
    prepare({candidateName, clientName, placementDate, status, totalInvoice}) {
      const statusLabels: Record<string, string> = {
        pending: "⏳ Pending",
        invoiced: "📄 Invoiced",
        paid: "✅ Paid",
        deducted: "❌ Deducted",
        partially_paid: "⚠️ Partial",
      };

      // Format date as DD/MM/YYYY
      let formattedDate = "";
      if (placementDate) {
        const date = new Date(placementDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        formattedDate = `${day}/${month}/${year}`;
      }

      // Format currency
      const formattedAmount = totalInvoice ? `₹${totalInvoice.toLocaleString("en-IN")}` : "";

      return {
        title: `${candidateName || "Unknown"} → ${clientName || "Unknown"}`,
        subtitle: `${formattedDate} • ${formattedAmount} • ${statusLabels[status] || status || ""}`,
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
