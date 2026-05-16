import {defineField, defineType} from "sanity";

import {
  candidateSourceLabels,
  candidateStatusEmoji,
  candidateStatusLabels,
  labeled,
  previewSubtitle,
  withEmoji,
} from "../lib/preview";
import {candidateTypeIcon} from "../lib/studio-icons";

export const candidate = defineType({
  name: "candidate",
  title: "Candidate",
  type: "document",
  icon: candidateTypeIcon,
  fieldsets: [
    {
      name: "identity",
      title: "Identity & Contact",
      description: "Name and how to reach this candidate",
      options: {collapsible: true, collapsed: false, columns: 2},
    },
    {
      name: "pipeline",
      title: "Pipeline & Ownership",
      description: "Availability status and assigned recruiter",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "professional",
      title: "Professional Profile",
      description: "Skills, experience, education, and current role",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "compensation",
      title: "Compensation & Notice",
      description: "Salary expectations and notice period",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "preferences",
      title: "Location & Work Preferences",
      description: "Where and how the candidate prefers to work",
      options: {collapsible: true, collapsed: true},
    },
    {
      name: "documents",
      title: "Resume & Links",
      description: "CV and professional profiles",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "sourcing",
      title: "Sourcing & Follow-up",
      description: "Lead source and communication touchpoints",
      options: {collapsible: true, collapsed: true},
    },
    {
      name: "meta",
      title: "Record Info",
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    // — Identity & Contact —
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      fieldset: "identity",
      description: "Candidate's legal or preferred full name",
      validation: (Rule) => Rule.required().error("Full name is required"),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      fieldset: "identity",
      description: "Primary email address",
      validation: (Rule) => Rule.email().error("Please enter a valid email"),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      fieldset: "identity",
      description: "Primary mobile or phone number",
    }),
    defineField({
      name: "alternateEmail",
      title: "Alternate Email",
      type: "string",
      fieldset: "identity",
      description: "Secondary email, if any",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || String(value).trim() === "") return true;
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
          return ok || "Please enter a valid email";
        }),
    }),
    defineField({
      name: "alternatePhone",
      title: "Alternate Phone",
      type: "string",
      fieldset: "identity",
      description: "Secondary contact number, if any",
    }),

    // — Pipeline & Ownership —
    defineField({
      name: "status",
      title: "Availability Status",
      type: "string",
      fieldset: "pipeline",
      description: "Current availability in your talent pool",
      options: {
        list: [
          {title: "Immediately Available", value: "immediately_available"},
          {title: "Available for Next 30 Days", value: "available_next_30_days"},
          {title: "On Notice Period", value: "on_notice_period"},
          {title: "Not Available", value: "not_available"},
          {title: "On Hold", value: "on_hold"},
          {title: "Placed", value: "placed"},
        ],
        layout: "radio",
      },
      initialValue: "immediately_available",
      validation: (Rule) => Rule.required().error("Status is required"),
    }),
    defineField({
      name: "assignedRecruiter",
      title: "Assigned Recruiter",
      type: "reference",
      to: [{type: "teamMember"}],
      fieldset: "pipeline",
      description: "Internal owner responsible for this candidate",
      options: {
        filter: '_type == "teamMember" && isActive == true',
      },
    }),

    // — Professional Profile —
    defineField({
      name: "primarySkill",
      title: "Primary Skill / Role",
      type: "string",
      fieldset: "professional",
      description: "Main role or expertise (e.g. React Developer, Sales Manager)",
      validation: (Rule) => Rule.required().error("Primary skill is required"),
    }),
    defineField({
      name: "skills",
      title: "All Skills",
      type: "array",
      of: [{type: "string"}],
      fieldset: "professional",
      description: "Additional skills and technologies",
      options: {layout: "tags"},
    }),
    defineField({
      name: "experience",
      title: "Years of Experience",
      type: "number",
      fieldset: "professional",
      description: "Total years of relevant professional experience",
      validation: (Rule) => Rule.min(0).max(50).error("Experience must be between 0 and 50 years"),
    }),
    defineField({
      name: "highestEducation",
      title: "Highest Education",
      type: "string",
      fieldset: "professional",
      description: "Highest qualification (e.g. B.Tech, MBA, 12th pass)",
    }),
    defineField({
      name: "currentCompany",
      title: "Current Company",
      type: "string",
      fieldset: "professional",
      description: "Employer the candidate is currently working with",
    }),
    defineField({
      name: "currentDesignation",
      title: "Current Designation",
      type: "string",
      fieldset: "professional",
      description: "Current job title or designation",
    }),
    defineField({
      name: "currentLocation",
      title: "Current Location",
      type: "string",
      fieldset: "professional",
      description: "City or region where the candidate is based today",
    }),

    // — Compensation & Notice —
    defineField({
      name: "currentSalary",
      title: "Current Salary (INR p.a.)",
      type: "number",
      fieldset: "compensation",
      description: "Current annual CTC in Indian Rupees",
      validation: (Rule) => Rule.min(0).error("Salary must be a positive number"),
    }),
    defineField({
      name: "expectedSalary",
      title: "Expected Salary (INR p.a.)",
      type: "number",
      fieldset: "compensation",
      description: "Expected annual CTC in Indian Rupees",
      validation: (Rule) => Rule.min(0).error("Salary must be a positive number"),
    }),
    defineField({
      name: "noticePeriod",
      title: "Notice Period (Days)",
      type: "number",
      fieldset: "compensation",
      description: "Days of notice required at current employer",
      validation: (Rule) =>
        Rule.min(0).max(180).error("Notice period must be between 0 and 180 days"),
    }),

    // — Location & Work Preferences —
    defineField({
      name: "remotePreference",
      title: "Work Mode Preference",
      type: "string",
      fieldset: "preferences",
      description: "Preferred on-site, hybrid, remote, or flexible arrangement",
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
      name: "willingToRelocate",
      title: "Willing to Relocate",
      type: "boolean",
      fieldset: "preferences",
      description: "Whether the candidate will move for the right role",
      initialValue: false,
    }),
    defineField({
      name: "preferredLocations",
      title: "Preferred Work Locations",
      type: "array",
      of: [{type: "string"}],
      fieldset: "preferences",
      description: "Cities or regions the candidate is open to working in",
      options: {layout: "tags"},
    }),
    defineField({
      name: "languages",
      title: "Languages",
      type: "array",
      of: [{type: "string"}],
      fieldset: "preferences",
      description: "Languages the candidate speaks or writes",
      options: {layout: "tags"},
    }),

    // — Resume & Links —
    defineField({
      name: "resume",
      title: "Resume",
      type: "file",
      fieldset: "documents",
      description: "Upload resume (PDF, DOC, or DOCX)",
      options: {accept: ".pdf,.doc,.docx"},
    }),
    defineField({
      name: "linkedInUrl",
      title: "LinkedIn Profile",
      type: "url",
      fieldset: "documents",
      description: "Full LinkedIn profile URL",
      validation: (Rule) =>
        Rule.uri({scheme: ["http", "https"]}).error("Please enter a valid URL"),
    }),

    // — Sourcing & Follow-up —
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      fieldset: "sourcing",
      description: "How this candidate entered your pipeline",
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
      name: "lastContactedAt",
      title: "Last Contacted",
      type: "datetime",
      fieldset: "sourcing",
      description: "Last call, email, or meeting with the candidate",
    }),
    defineField({
      name: "nextFollowUpAt",
      title: "Next Follow-up",
      type: "datetime",
      fieldset: "sourcing",
      description: "Scheduled date and time for the next touchpoint",
    }),

    // — Notes & metadata —
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      description: "Private recruiter notes (not visible to the candidate)",
      rows: 4,
    }),
    defineField({
      name: "createdAt",
      title: "Added On",
      type: "datetime",
      fieldset: "meta",
      description: "When this candidate was added to the ATS",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      fullName: "fullName",
      primarySkill: "primarySkill",
      status: "status",
      email: "email",
      phone: "phone",
      experience: "experience",
      currentCompany: "currentCompany",
      currentDesignation: "currentDesignation",
      noticePeriod: "noticePeriod",
      recruiterName: "assignedRecruiter.name",
      source: "source",
    },
    prepare({
      fullName,
      primarySkill,
      status,
      email,
      phone,
      experience,
      currentCompany,
      currentDesignation,
      noticePeriod,
      recruiterName,
      source,
    }) {
      const role =
        currentDesignation && currentCompany
          ? `${currentDesignation} @ ${currentCompany}`
          : currentDesignation || currentCompany;

      return {
        title: fullName || "Untitled candidate",
        subtitle: previewSubtitle(
          withEmoji(status, candidateStatusLabels, candidateStatusEmoji),
          primarySkill || "No primary skill",
          role,
          experience != null && `${experience} yrs exp`,
          noticePeriod != null && `${noticePeriod}d notice`,
          email,
          phone,
          recruiterName && `Owner: ${recruiterName}`,
          labeled(source, candidateSourceLabels, undefined),
        ),
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
