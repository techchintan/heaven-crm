import {defineField, defineType} from "sanity";
import {CaseIcon} from "@sanity/icons";

export const client = defineType({
  name: "client",
  title: "Client",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      description: "Official company name",
      validation: (Rule) => Rule.required().error("Company name is required"),
    }),
    defineField({
      name: "legalName",
      title: "Legal / Registered Name",
      type: "string",
      description: "If different from the display name (invoices, contracts)",
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      description: "Industry sector",
      options: {
        list: [
          {title: "IT & Software", value: "it_software"},
          {title: "Banking & Finance", value: "banking_finance"},
          {title: "Healthcare", value: "healthcare"},
          {title: "Manufacturing", value: "manufacturing"},
          {title: "E-commerce", value: "ecommerce"},
          {title: "Consulting", value: "consulting"},
          {title: "Education", value: "education"},
          {title: "Telecom", value: "telecom"},
          {title: "Retail", value: "retail"},
          {title: "Other", value: "other"},
        ],
      },
    }),
    defineField({
      name: "gstin",
      title: "GSTIN",
      type: "string",
      description: "GST Identification Number (15 characters)",
      validation: (Rule) =>
        Rule.custom((gstin) => {
          if (!gstin) return true; // Optional field
          // GSTIN format: 2 digit state code + 10 char PAN + 1 entity code + 1 check digit + Z
          const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
          return gstinRegex.test(gstin) ? true : "Invalid GSTIN format";
        }),
    }),
    defineField({
      name: "pan",
      title: "PAN",
      type: "string",
      description: "Permanent Account Number (10 characters)",
      validation: (Rule) =>
        Rule.custom((pan) => {
          if (!pan) return true; // Optional field
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
          return panRegex.test(pan) ? true : "Invalid PAN format (e.g., ABCDE1234F)";
        }),
    }),
    defineField({
      name: "contacts",
      title: "Client Contacts (POCs)",
      type: "array",
      description: "One client can have multiple points of contact",
      of: [
        defineField({
          name: "contact",
          title: "Contact",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required().error("Contact name is required"),
            }),
            defineField({
              name: "designation",
              title: "Designation",
              type: "string",
            }),
            defineField({
              name: "email",
              title: "Email",
              type: "string",
              validation: (Rule) => Rule.required().email().error("A valid email is required"),
            }),
            defineField({
              name: "phone",
              title: "Phone",
              type: "string",
            }),
            defineField({
              name: "isActive",
              title: "Active",
              type: "boolean",
              description: "Use this to mark only current POCs as active",
              initialValue: true,
            }),
            defineField({
              name: "isPrimary",
              title: "Primary Contact",
              type: "boolean",
              description: "Mark the main POC for day-to-day communication",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: "name",
              designation: "designation",
              email: "email",
              isActive: "isActive",
            },
            prepare({title, designation, email, isActive}) {
              const status = isActive === false ? "Inactive" : "Active";
              return {
                title: title || "Unnamed contact",
                subtitle: `${designation || "No designation"} | ${email || "No email"} | ${status}`,
              };
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required().min(1).error("Add at least one contact person for this client"),
    }),
    defineField({
      name: "billingEmail",
      title: "Billing Email",
      type: "string",
      description: "Email for invoices and billing",
      validation: (Rule) => Rule.email().error("Please enter a valid email"),
    }),
    defineField({
      name: "billingAddress",
      title: "Billing Address",
      type: "text",
      description: "Complete billing address",
      rows: 3,
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      description: "Company website URL",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }).error("Please enter a valid URL"),
    }),
    defineField({
      name: "feeModel",
      title: "Fee Model",
      type: "string",
      description: "How you typically charge this client",
      options: {
        list: [
          {title: "% of annual CTC", value: "percent_ctc"},
          {title: "% of fixed fee (lump sum)", value: "percent_fixed_fee"},
          {title: "Flat success fee per hire", value: "flat_per_hire"},
          {title: "Mixed / custom", value: "mixed"},
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "agreementFeePercentage",
      title: "Default Fee Percentage",
      type: "number",
      description: "Default recruitment fee percentage for this client",
      initialValue: 8.33,
      validation: (Rule) => Rule.min(0).max(100).error("Fee percentage must be between 0 and 100"),
    }),
    defineField({
      name: "paymentTerms",
      title: "Payment Terms (Days)",
      type: "number",
      description: "Number of days for payment (e.g., 30, 45, 60)",
      initialValue: 30,
      validation: (Rule) =>
        Rule.min(0).max(180).error("Payment terms must be between 0 and 180 days"),
    }),
    defineField({
      name: "msaStartDate",
      title: "MSA / Framework Start",
      type: "date",
      description: "Master agreement or commercial framework start",
      options: {dateFormat: "DD/MM/YYYY"},
    }),
    defineField({
      name: "msaEndDate",
      title: "MSA / Framework End",
      type: "date",
      description: "Renew or renegotiate before this date",
      options: {dateFormat: "DD/MM/YYYY"},
      validation: (Rule) =>
        Rule.custom((end, context) => {
          if (!end) return true;
          const start = context.document?.msaStartDate as string | undefined;
          if (start && end < start) {
            return "End date cannot be before start date";
          }
          return true;
        }),
    }),
    defineField({
      name: "leadSource",
      title: "Lead Source",
      type: "string",
      options: {
        list: [
          {title: "Inbound / Website", value: "inbound"},
          {title: "Referral", value: "referral"},
          {title: "Outbound / BD", value: "outbound"},
          {title: "Job board / Marketplace", value: "job_board"},
          {title: "Event", value: "event"},
          {title: "Existing client expansion", value: "expansion"},
          {title: "Other", value: "other"},
        ],
      },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Client relationship status",
      options: {
        list: [
          {title: "Active", value: "active"},
          {title: "Inactive", value: "inactive"},
          {title: "Prospect", value: "prospect"},
          {title: "On Hold", value: "on_hold"},
        ],
        layout: "radio",
      },
      initialValue: "active",
    }),
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      description: "Private notes about this client",
      rows: 4,
    }),
    defineField({
      name: "createdAt",
      title: "Added On",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "companyName",
      subtitle: "industry",
      status: "status",
    },
    prepare({title, subtitle, status}) {
      const industryLabels: Record<string, string> = {
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
      const statusIndicator = status === "active" ? "●" : status === "inactive" ? "○" : "◐";
      return {
        title: title || "Untitled",
        subtitle: `${statusIndicator} ${industryLabels[subtitle] || subtitle || "No industry"}`,
      };
    },
  },
  orderings: [
    {
      title: "Company Name A-Z",
      name: "companyNameAsc",
      by: [{field: "companyName", direction: "asc"}],
    },
    {
      title: "Recently Added",
      name: "createdAtDesc",
      by: [{field: "createdAt", direction: "desc"}],
    },
  ],
});
