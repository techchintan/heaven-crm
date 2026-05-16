import {defineArrayMember, defineField, defineType} from "sanity";

import {isValidEmployeeCode} from "../lib/employee-code";
import {
  labeled,
  previewInr,
  previewSubtitle,
  teamRoleLabels,
  workStatusLabels,
} from "../lib/preview";
import {teamMemberTypeIcon} from "../lib/studio-icons";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: teamMemberTypeIcon,
  fieldsets: [
    {
      name: "profile",
      title: "Profile",
      description: "Employee ID, names, contact, and role",
      options: {collapsible: true, collapsed: false, columns: 2},
    },
    {
      name: "personal",
      title: "Personal Details",
      description: "Residential address and parent or guardian contacts",
      options: {collapsible: true, collapsed: true},
    },
    {
      name: "employment",
      title: "Employment",
      description: "Active status, work type, and tenure dates",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "compensation",
      title: "Compensation & Notes",
      description: "Salary, incentives, and internal HR notes",
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    // — Profile —
    defineField({
      name: "employeeCode",
      title: "Employee Code",
      type: "string",
      fieldset: "profile",
      description:
        "Assigned once on first publish (e.g. HPSE01). Stays the same on later edits. Read-only.",
      readOnly: true,
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || String(value).trim() === "") return true;
          return isValidEmployeeCode(String(value)) ? true : "Use format HPSE01 (HPS + E + number)";
        }),
    }),
    defineField({
      name: "name",
      title: "Display Name",
      type: "string",
      fieldset: "profile",
      description: "Name shown in the ATS (may differ from legal name)",
      validation: (Rule) => Rule.required().error("Display name is required"),
    }),
    defineField({
      name: "legalName",
      title: "Legal Name",
      type: "string",
      fieldset: "profile",
      description: "Full legal name as per government ID or payroll records",
    }),
    defineField({
      name: "email",
      title: "Work Email",
      type: "string",
      fieldset: "profile",
      description: "Official work email address",
      validation: (Rule) => Rule.required().email().error("A valid email is required"),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      fieldset: "profile",
      description: "Primary mobile or phone number",
    }),
    defineField({
      name: "alternatePhone",
      title: "Alternate Phone Number",
      type: "string",
      fieldset: "profile",
      description: "Secondary contact number",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      fieldset: "profile",
      description: "Position in the organization (e.g. Senior Recruiter)",
      options: {
        list: [
          {title: "Trainee", value: "trainee"},
          {title: "Recruiter", value: "recruiter"},
          {title: "Senior Recruiter", value: "senior_recruiter"},
          {title: "Team Lead", value: "team_lead"},
          {title: "Manager", value: "manager"},
          {title: "Founder & CEO", value: "founder_ceo"},
        ],
      },
      validation: (Rule) => Rule.required().error("Role is required"),
    }),
    defineField({
      name: "specializations",
      title: "Specializations",
      type: "array",
      fieldset: "profile",
      description: "Domains or verticals this person mainly recruits for",
      of: [{type: "string"}],
      options: {layout: "tags"},
    }),

    // — Personal Details —
    defineField({
      name: "residentialAddress",
      title: "Full Residential Address",
      type: "text",
      fieldset: "personal",
      description: "Complete home address including city, state, and PIN code",
      rows: 4,
    }),
    defineField({
      name: "parentContacts",
      title: "Parent / Guardian Details",
      type: "array",
      fieldset: "personal",
      description: "Emergency or family contacts (name, phone, and relation)",
      of: [
        defineArrayMember({
          type: "object",
          name: "parentContact",
          title: "Contact",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              description: "Parent or guardian full name",
              validation: (Rule) => Rule.required().error("Name is required"),
            }),
            defineField({
              name: "phone",
              title: "Phone Number",
              type: "string",
              description: "Contact phone number",
              validation: (Rule) => Rule.required().error("Phone number is required"),
            }),
            defineField({
              name: "relation",
              title: "Relation",
              type: "string",
              description: "Relationship to the team member",
              options: {
                list: [
                  {title: "Father", value: "father"},
                  {title: "Mother", value: "mother"},
                  {title: "Guardian", value: "guardian"},
                  {title: "Spouse", value: "spouse"},
                  {title: "Sibling", value: "sibling"},
                  {title: "Other", value: "other"},
                ],
              },
              validation: (Rule) => Rule.required().error("Relation is required"),
            }),
          ],
          preview: {
            select: {
              name: "name",
              phone: "phone",
              relation: "relation",
            },
            prepare({name, phone, relation}) {
              const relationLabels: Record<string, string> = {
                father: "Father",
                mother: "Mother",
                guardian: "Guardian",
                spouse: "Spouse",
                sibling: "Sibling",
                other: "Other",
              };
              return {
                title: name || "Unnamed contact",
                subtitle: previewSubtitle(relationLabels[relation] || relation, phone),
              };
            },
          },
        }),
      ],
    }),

    // — Employment —
    defineField({
      name: "isActive",
      title: "Active on Team",
      type: "boolean",
      fieldset: "employment",
      description: "Whether this person is currently on the team",
      initialValue: true,
    }),
    defineField({
      name: "workStatus",
      title: "Work Status",
      type: "string",
      fieldset: "employment",
      description: "Full-time, part-time, contract, or intern",
      options: {
        list: [
          {title: "Full-time", value: "full_time"},
          {title: "Part-time", value: "part_time"},
          {title: "Contract", value: "contract"},
          {title: "Intern", value: "intern"},
        ],
      },
      validation: (Rule) => Rule.required().error("Work status is required"),
    }),
    defineField({
      name: "joinedAt",
      title: "Joined Date",
      type: "date",
      fieldset: "employment",
      description: "Date they joined the organization",
      options: {dateFormat: "DD/MM/YYYY"},
      validation: (Rule) => Rule.required().error("Joined date is required"),
    }),
    defineField({
      name: "leftAt",
      title: "Left Date",
      type: "date",
      fieldset: "employment",
      description: "Last working day if they are no longer active",
      options: {dateFormat: "DD/MM/YYYY"},
      validation: (Rule) =>
        Rule.custom((leftAt, context) => {
          if (!leftAt) return true;
          const joinedAt = context.document?.joinedAt as string | undefined;
          if (joinedAt && leftAt < joinedAt) {
            return "Left date cannot be before joined date";
          }
          return true;
        }),
    }),

    // — Compensation & Notes —
    defineField({
      name: "salary",
      title: "Annual Salary (INR)",
      type: "number",
      fieldset: "compensation",
      description: "Annual CTC in Indian Rupees",
      validation: (Rule) => Rule.min(0).error("Salary must be zero or greater"),
    }),
    defineField({
      name: "incentivePercentage",
      title: "Placement Incentive (%)",
      type: "number",
      fieldset: "compensation",
      description: "Default placement incentive percentage for this team member",
      validation: (Rule) =>
        Rule.min(0).max(100).precision(2).warning("Use a value between 0 and 100"),
    }),
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      fieldset: "compensation",
      rows: 4,
      description: "Internal HR or admin notes",
    }),
  ],
  preview: {
    select: {
      name: "name",
      legalName: "legalName",
      employeeCode: "employeeCode",
      role: "role",
      email: "email",
      phone: "phone",
      workStatus: "workStatus",
      isActive: "isActive",
      specializations: "specializations",
      incentivePercentage: "incentivePercentage",
      salary: "salary",
    },
    prepare({
      name,
      legalName,
      employeeCode,
      role,
      email,
      phone,
      workStatus,
      isActive,
      specializations,
      incentivePercentage,
      salary,
    }) {
      const specs = Array.isArray(specializations)
        ? specializations.slice(0, 3).join(", ")
        : undefined;
      const roleLabel = labeled(role, teamRoleLabels, "No role");
      const displayName = name || "Untitled team member";
      const title = employeeCode ? `${employeeCode} · ${displayName}` : displayName;

      return {
        title: isActive === false ? `${title} (Inactive)` : title,
        subtitle: previewSubtitle(
          legalName && legalName !== name && `Legal: ${legalName}`,
          roleLabel,
          labeled(workStatus, workStatusLabels, undefined),
          previewInr(salary),
          incentivePercentage != null && `${incentivePercentage}% incentive`,
          specs,
          email,
          phone,
        ),
      };
    },
  },
  orderings: [
    {
      title: "Employee Code",
      name: "employeeCodeAsc",
      by: [{field: "employeeCode", direction: "asc"}],
    },
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{field: "name", direction: "asc"}],
    },
  ],
});
