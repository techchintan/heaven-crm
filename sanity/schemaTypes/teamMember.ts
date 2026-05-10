import {defineField, defineType} from "sanity";
import {UserIcon} from "@sanity/icons";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      description: "Recruiter's full name",
      validation: (Rule) => Rule.required().error("Name is required"),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Work email address",
      validation: (Rule) => Rule.required().email().error("A valid email is required"),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Job title (e.g., Senior Recruiter)",
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
      name: "workStatus",
      title: "Work Status",
      type: "string",
      description: "Employment type",
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
      name: "specializations",
      title: "Specializations",
      type: "array",
      description: "Domains this team member mainly handles",
      of: [{type: "string"}],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: "Contact number",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Is this team member currently active?",
      initialValue: true,
    }),
    defineField({
      name: "joinedAt",
      title: "Joined Date",
      type: "date",
      options: {
        dateFormat: "DD/MM/YYYY",
      },
      validation: (Rule) => Rule.required().error("Joined date is required"),
    }),
    defineField({
      name: "leftAt",
      title: "Left Date",
      type: "date",
      description: "Last working date, if inactive",
      options: {
        dateFormat: "DD/MM/YYYY",
      },
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
    defineField({
      name: "incentivePercentage",
      title: "Incentive (%)",
      type: "number",
      description: "Default incentive percentage for this team member",
      validation: (Rule) =>
        Rule.min(0).max(100).precision(2).warning("Use a value between 0 and 100"),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 4,
      description: "Internal HR/admin notes",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      isActive: "isActive",
    },
    prepare({title, subtitle, isActive}) {
      const roleLabels: Record<string, string> = {
        trainee: "Trainee",
        recruiter: "Recruiter",
        senior_recruiter: "Senior Recruiter",
        team_lead: "Team Lead",
        manager: "Manager",
        founder_ceo: "Founder & CEO",
      };
      return {
        title: title || "Untitled",
        subtitle: `${roleLabels[subtitle] || subtitle || "No role"} ${isActive === false ? "(Inactive)" : ""}`,
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
