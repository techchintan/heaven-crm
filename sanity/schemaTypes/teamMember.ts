import {defineField, defineType} from "sanity";

import {labeled, previewSubtitle, teamRoleLabels, workStatusLabels} from "../lib/preview";
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
      description: "Name, contact details, and role",
      options: {collapsible: true, collapsed: false, columns: 2},
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
      description: "Default incentive and internal HR notes",
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    // — Profile —
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      fieldset: "profile",
      description: "Team member's full name as shown in the ATS",
      validation: (Rule) => Rule.required().error("Name is required"),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      fieldset: "profile",
      description: "Work email address",
      validation: (Rule) => Rule.required().email().error("A valid email is required"),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      fieldset: "profile",
      description: "Mobile or desk phone number",
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
      name: "incentivePercentage",
      title: "Incentive (%)",
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
      role: "role",
      email: "email",
      phone: "phone",
      workStatus: "workStatus",
      isActive: "isActive",
      specializations: "specializations",
      incentivePercentage: "incentivePercentage",
    },
    prepare({name, role, email, phone, workStatus, isActive, specializations, incentivePercentage}) {
      const specs = Array.isArray(specializations)
        ? specializations.slice(0, 3).join(", ")
        : undefined;
      const roleLabel = labeled(role, teamRoleLabels, "No role");

      return {
        title: isActive === false ? `${name || "Untitled"} (Inactive)` : name || "Untitled team member",
        subtitle: previewSubtitle(
          roleLabel,
          labeled(workStatus, workStatusLabels, undefined),
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
      title: "Name A-Z",
      name: "nameAsc",
      by: [{field: "name", direction: "asc"}],
    },
  ],
});
