import {defineField, defineType} from "sanity";
import {UsersIcon} from "@sanity/icons";

export const candidate = defineType({
  name: "candidate",
  title: "Candidate",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      description: "Candidate's full name",
      validation: (Rule) => Rule.required().error("Full name is required"),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Candidate's email address",
      validation: (Rule) => Rule.email().error("Please enter a valid email"),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: "Contact number",
    }),
    defineField({
      name: "primarySkill",
      title: "Primary Skill",
      type: "string",
      description: "Main skill or expertise (e.g., React Developer, Sales Manager)",
      validation: (Rule) => Rule.required().error("Primary skill is required"),
    }),
    defineField({
      name: "skills",
      title: "All Skills",
      type: "array",
      of: [{type: "string"}],
      description: "List of all skills and technologies",
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "experience",
      title: "Years of Experience",
      type: "number",
      description: "Total years of professional experience",
      validation: (Rule) => Rule.min(0).max(50).error("Experience must be between 0 and 50 years"),
    }),
    defineField({
      name: "currentSalary",
      title: "Current Salary (INR)",
      type: "number",
      description: "Current annual salary in Indian Rupees",
      validation: (Rule) => Rule.min(0).error("Salary must be a positive number"),
    }),
    defineField({
      name: "expectedSalary",
      title: "Expected Salary (INR)",
      type: "number",
      description: "Expected annual salary in Indian Rupees",
      validation: (Rule) => Rule.min(0).error("Salary must be a positive number"),
    }),
    defineField({
      name: "noticePeriod",
      title: "Notice Period (Days)",
      type: "number",
      description: "Notice period in days",
      validation: (Rule) =>
        Rule.min(0).max(180).error("Notice period must be between 0 and 180 days"),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Current availability status",
      options: {
        list: [
          {title: "Available", value: "available"},
          {title: "Placed", value: "placed"},
          {title: "In Process", value: "in_process"},
          {title: "On Hold", value: "on_hold"},
          {title: "Not Available", value: "not_available"},
        ],
        layout: "radio",
      },
      initialValue: "available",
      validation: (Rule) => Rule.required().error("Status is required"),
    }),
    defineField({
      name: "linkedInUrl",
      title: "LinkedIn Profile",
      type: "url",
      description: "LinkedIn profile URL",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }).error("Please enter a valid URL"),
    }),
    defineField({
      name: "resume",
      title: "Resume",
      type: "file",
      description: "Upload resume (PDF, DOC, DOCX)",
      options: {
        accept: ".pdf,.doc,.docx",
      },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Current city/location",
    }),
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      description: "Private notes for recruiters (not visible to candidate)",
      rows: 4,
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "Where did this candidate come from?",
      options: {
        list: [
          {title: "LinkedIn", value: "linkedin"},
          {title: "Naukri", value: "naukri"},
          {title: "Referral", value: "referral"},
          {title: "Job Portal", value: "job_portal"},
          {title: "Direct Application", value: "direct"},
          {title: "Other", value: "other"},
        ],
      },
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
      title: "fullName",
      subtitle: "primarySkill",
      status: "status",
    },
    prepare({title, subtitle, status}) {
      const statusLabels: Record<string, string> = {
        available: "Available",
        placed: "Placed",
        in_process: "In Process",
        on_hold: "On Hold",
        not_available: "Not Available",
      };
      const statusEmoji: Record<string, string> = {
        available: "🟢",
        placed: "✅",
        in_process: "🟡",
        on_hold: "🟠",
        not_available: "🔴",
      };
      return {
        title: title || "Untitled",
        subtitle: `${subtitle || "No skill"} • ${statusEmoji[status] || ""} ${statusLabels[status] || status || "Unknown"}`,
      };
    },
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{field: "fullName", direction: "asc"}],
    },
    {
      title: "Recently Added",
      name: "createdAtDesc",
      by: [{field: "createdAt", direction: "desc"}],
    },
    {
      title: "Experience (High to Low)",
      name: "experienceDesc",
      by: [{field: "experience", direction: "desc"}],
    },
  ],
});
