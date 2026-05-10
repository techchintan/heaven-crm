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
      validation: (Rule) =>
        Rule.required()
          .email()
          .error("A valid email is required"),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Job title (e.g., Senior Recruiter)",
      options: {
        list: [
          {title: "Recruiter", value: "recruiter"},
          {title: "Senior Recruiter", value: "senior_recruiter"},
          {title: "Team Lead", value: "team_lead"},
          {title: "Manager", value: "manager"},
        ],
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
        recruiter: "Recruiter",
        senior_recruiter: "Senior Recruiter",
        team_lead: "Team Lead",
        manager: "Manager",
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
