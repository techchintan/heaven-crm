import {defineField, defineType} from "sanity";

import {
  clientStatusEmoji,
  clientStatusLabels,
  feeModelLabels,
  industryLabels,
  labeled,
  leadSourceLabels,
  previewSubtitle,
  withEmoji,
} from "../lib/preview";
import {
  indianStateLabels,
  indianStateOptions,
  validateGstin,
  validatePan,
} from "../lib/indian-states";
import {clientTypeIcon} from "../lib/studio-icons";

export const client = defineType({
  name: "client",
  title: "Client",
  type: "document",
  icon: clientTypeIcon,
  fieldsets: [
    {
      name: "overview",
      title: "Company Overview",
      description: "Display name, status, industry, and website",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "legal",
      title: "Legal & Tax",
      description: "Registered name and state-wise GST / PAN for each branch",
      options: {collapsible: true, collapsed: true},
    },
    {
      name: "contactPeople",
      title: "Points of Contact",
      description: "Client POCs for hiring and day-to-day coordination",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "billing",
      title: "Billing Details",
      description: "Invoice delivery address and email",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "commercial",
      title: "Commercial Terms",
      description: "Default fees, payment terms, and agreement dates",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "relationship",
      title: "Relationship",
      description: "How you acquired this client and internal notes",
      options: {collapsible: true, collapsed: true},
    },
    {
      name: "meta",
      title: "Record Info",
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    // — Company Overview —
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      fieldset: "overview",
      description: "Display name used in the ATS and on invoices",
      validation: (Rule) => Rule.required().error("Company name is required"),
    }),
    defineField({
      name: "status",
      title: "Relationship Status",
      type: "string",
      fieldset: "overview",
      description: "Current stage of the client relationship",
      options: {
        list: [
          {title: "Active", value: "active"},
          {title: "Inactive", value: "inactive"},
          {title: "Prospect", value: "prospect"},
          {title: "In Progress", value: "in_progress"},
          {title: "On Hold", value: "on_hold"},
        ],
        layout: "radio",
      },
      initialValue: "active",
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      fieldset: "overview",
      description: "Primary industry sector",
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
      name: "website",
      title: "Website",
      type: "url",
      fieldset: "overview",
      description: "Company website URL",
      validation: (Rule) => Rule.uri({scheme: ["http", "https"]}).error("Please enter a valid URL"),
    }),

    // — Legal & Tax —
    defineField({
      name: "legalName",
      title: "Legal / Registered Name",
      type: "string",
      fieldset: "legal",
      description: "Registered name if different from display name (contracts, GST)",
    }),
    defineField({
      name: "stateTaxRegistrations",
      title: "State-wise GST & PAN",
      type: "array",
      fieldset: "legal",
      description: "Add one entry per state/branch where this client is registered for tax",
      of: [
        defineField({
          name: "registration",
          title: "State registration",
          type: "object",
          fields: [
            defineField({
              name: "state",
              title: "State / UT",
              type: "string",
              description: "Indian state or union territory for this branch",
              options: {list: [...indianStateOptions]},
              validation: (Rule) => Rule.required().error("State is required"),
            }),
            defineField({
              name: "branchName",
              title: "Branch / Office",
              type: "string",
              description: "Optional label (e.g. Mumbai HQ, Bangalore office)",
            }),
            defineField({
              name: "gstin",
              title: "GSTIN",
              type: "string",
              description: "15-character GST Identification Number for this state",
              validation: (Rule) => Rule.custom((gstin) => validateGstin(gstin)),
            }),
            defineField({
              name: "pan",
              title: "PAN",
              type: "string",
              description: "10-character PAN for this state registration",
              validation: (Rule) => Rule.custom((pan) => validatePan(pan)),
            }),
            defineField({
              name: "isPrimary",
              title: "Primary for billing",
              type: "boolean",
              description: "Use this registration by default on invoices",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              state: "state",
              branchName: "branchName",
              gstin: "gstin",
              pan: "pan",
              isPrimary: "isPrimary",
            },
            prepare({state, branchName, gstin, pan, isPrimary}) {
              const stateLabel = labeled(state, indianStateLabels, "State");
              return {
                title: isPrimary ? `★ ${stateLabel}` : stateLabel,
                subtitle: previewSubtitle(
                  branchName,
                  gstin && `GSTIN: ${gstin}`,
                  pan && `PAN: ${pan}`,
                ),
              };
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((entries) => {
          if (!entries || !Array.isArray(entries) || entries.length === 0) return true;

          const keys = entries.map((entry) => {
            const {state, branchName} = entry as {state?: string; branchName?: string};
            return `${state ?? ""}::${(branchName ?? "").trim().toLowerCase()}`;
          });
          const uniqueKeys = new Set(keys);
          if (uniqueKeys.size !== keys.length) {
            return "Duplicate state and branch combination — use a distinct branch name when the state is the same";
          }

          const primaryCount = entries.filter(
            (entry) => (entry as {isPrimary?: boolean}).isPrimary,
          ).length;
          if (primaryCount > 1) {
            return "Only one state registration can be marked as primary for billing";
          }

          return true;
        }),
    }),

    // — Points of Contact —
    defineField({
      name: "contacts",
      title: "Client Contacts (POCs)",
      type: "array",
      fieldset: "contactPeople",
      description: "Add one or more points of contact at this client",
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
              description: "Contact person's full name",
              validation: (Rule) => Rule.required().error("Contact name is required"),
            }),
            defineField({
              name: "designation",
              title: "Designation",
              type: "string",
              description: "Job title or role at the client",
            }),
            defineField({
              name: "email",
              title: "Email",
              type: "string",
              description: "Work email for this contact",
              validation: (Rule) => Rule.required().email().error("A valid email is required"),
            }),
            defineField({
              name: "phone",
              title: "Phone",
              type: "string",
              description: "Direct phone or mobile number",
            }),
            defineField({
              name: "isPrimary",
              title: "Primary Contact",
              type: "boolean",
              description: "Main POC for day-to-day hiring communication",
              initialValue: false,
            }),
            defineField({
              name: "isActive",
              title: "Active",
              type: "boolean",
              description: "Uncheck if this person is no longer at the client",
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: "name",
              designation: "designation",
              email: "email",
              phone: "phone",
              isActive: "isActive",
              isPrimary: "isPrimary",
            },
            prepare({title, designation, email, phone, isActive, isPrimary}) {
              const displayName = title || "Unnamed contact";
              return {
                title: isPrimary ? `★ ${displayName}` : displayName,
                subtitle: previewSubtitle(
                  designation || "No designation",
                  email,
                  phone,
                  isActive === false ? "Inactive" : isPrimary ? "Primary · Active" : "Active",
                ),
              };
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required().min(1).error("Add at least one contact person for this client"),
    }),

    // — Billing Details —
    defineField({
      name: "billingEmail",
      title: "Billing Email",
      type: "string",
      fieldset: "billing",
      description: "Email address for invoices and payment follow-ups",
      validation: (Rule) => Rule.email().error("Please enter a valid email"),
    }),
    defineField({
      name: "billingAddress",
      title: "Billing Address",
      type: "text",
      fieldset: "billing",
      description: "Full billing address as it should appear on invoices",
      rows: 3,
    }),

    // — Commercial Terms —
    defineField({
      name: "feeModel",
      title: "Fee Model",
      type: "string",
      fieldset: "commercial",
      description: "Default way you charge this client for placements",
      options: {
        list: [
          {title: "% of annual CTC", value: "percent_ctc"},
          {title: "Flat success fee per hire", value: "flat_per_hire"},
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "agreementFeePercentage",
      title: "Default Fee Percentage",
      type: "number",
      fieldset: "commercial",
      description: "Default recruitment fee % applied to new placements",
      initialValue: 8.33,
      validation: (Rule) => Rule.min(0).max(100).error("Fee percentage must be between 0 and 100"),
    }),
    defineField({
      name: "paymentTerms",
      title: "Payment Terms (Days)",
      type: "number",
      fieldset: "commercial",
      description: "Net days for invoice payment (e.g. 30, 45, 60)",
      initialValue: 30,
      validation: (Rule) =>
        Rule.min(0).max(180).error("Payment terms must be between 0 and 180 days"),
    }),
    defineField({
      name: "msaStartDate",
      title: "MSA / Framework Start",
      type: "date",
      fieldset: "commercial",
      description: "Start date of master or commercial agreement",
      options: {dateFormat: "DD/MM/YYYY"},
    }),
    defineField({
      name: "msaEndDate",
      title: "MSA / Framework End",
      type: "date",
      fieldset: "commercial",
      description: "Agreement end date — renew before this date",
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

    // — Relationship —
    defineField({
      name: "leadSource",
      title: "Lead Source",
      type: "string",
      fieldset: "relationship",
      description: "How this client relationship started",
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
      name: "notes",
      title: "Internal Notes",
      type: "text",
      fieldset: "relationship",
      description: "Private notes about this client (not shared externally)",
      rows: 4,
    }),

    // — Metadata —
    defineField({
      name: "createdAt",
      title: "Added On",
      type: "datetime",
      fieldset: "meta",
      description: "When this client was added to the ATS",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      companyName: "companyName",
      industry: "industry",
      status: "status",
      website: "website",
      feeModel: "feeModel",
      agreementFeePercentage: "agreementFeePercentage",
      paymentTerms: "paymentTerms",
      leadSource: "leadSource",
      billingEmail: "billingEmail",
    },
    prepare({
      companyName,
      industry,
      status,
      website,
      feeModel,
      agreementFeePercentage,
      paymentTerms,
      leadSource,
      billingEmail,
    }) {
      const feeLabel = feeModel ? labeled(feeModel, feeModelLabels) : undefined;
      const feeDetail =
        feeModel === "percent_ctc" && agreementFeePercentage != null
          ? `${feeLabel} · ${agreementFeePercentage}%`
          : feeLabel;

      return {
        title: companyName || "Untitled client",
        subtitle: previewSubtitle(
          withEmoji(status, clientStatusLabels, clientStatusEmoji),
          labeled(industry, industryLabels, "No industry"),
          feeDetail,
          paymentTerms != null && `Net ${paymentTerms} days`,
          labeled(leadSource, leadSourceLabels, undefined),
          billingEmail,
          website?.replace(/^https?:\/\//i, ""),
        ),
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
