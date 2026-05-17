import {defineQuery} from "next-sanity";

export const placementsQuery = defineQuery(`
  *[_type == "placement"] | order(placementDate desc) {
    _id,
    "candidate": candidate->{
      _id,
      fullName,
      primarySkill
    },
    "vendor": vendor->{
      _id,
      companyName
    },
    "recruiter": recruiter->{
      _id,
      name
    },
    jobTitle,
    baseSalary,
    feePercentage,
    gstPercentage,
    feeAmount,
    gstAmount,
    totalInvoiceValue,
    placementDate,
    probationEndDate,
    invoiceDate,
    exitDate,
    paymentDueDate,
    revenueStatus,
    invoiceNumber,
    paymentDate,
    amountReceived,
    notes,
    createdAt
  }
`);

export const candidatesQuery = defineQuery(`
  *[_type == "candidate"] | order(createdAt desc) {
    _id,
    fullName,
    email,
    phone,
    primarySkill,
    skills,
    experience,
    currentSalary,
    expectedSalary,
    noticePeriod,
    status,
    linkedInUrl,
    "location": currentLocation,
    source,
    notes,
    createdAt
  }
`);

export const vendorsQuery = defineQuery(`
  *[_type == "vendor"] | order(companyName asc) {
    _id,
    companyName,
    industry,
    stateTaxRegistrations[]{
      state,
      branchName,
      gstin,
      pan,
      isPrimary
    },
    "primaryContact": coalesce(
      contacts[isPrimary == true][0].name,
      contacts[0].name
    ),
    "contactDesignation": coalesce(
      contacts[isPrimary == true][0].designation,
      contacts[0].designation
    ),
    "contactEmail": coalesce(
      contacts[isPrimary == true][0].email,
      contacts[0].email
    ),
    "contactPhone": coalesce(
      contacts[isPrimary == true][0].phone,
      contacts[0].phone
    ),
    billingEmail,
    billingAddress,
    website,
    agreementFeePercentage,
    paymentTerms,
    status,
    notes,
    createdAt
  }
`);

export const teamMembersQuery = defineQuery(`
  *[_type == "teamMember"] | order(name asc) {
    _id,
    name,
    email,
    role,
    phone,
    isActive,
    joinedAt
  }
`);

export const placementByIdQuery = defineQuery(`
  *[_type == "placement" && _id == $id][0] {
    _id,
    "candidate": candidate->{
      _id,
      fullName,
      primarySkill,
      email,
      phone
    },
    "vendor": vendor->{
      _id,
      companyName,
      industry,
      agreementFeePercentage,
      paymentTerms
    },
    "recruiter": recruiter->{
      _id,
      name,
      email,
      role
    },
    jobTitle,
    engagementType,
    workArrangement,
    workLocation,
    vendorReference,
    offerAcceptedDate,
    baseSalary,
    feeMode,
    feePercentage,
    flatFeeAmount,
    gstPercentage,
    feeAmount,
    gstAmount,
    totalInvoiceValue,
    placementDate,
    probationPeriodDays,
    probationEndDate,
    invoiceDate,
    exitDate,
    paymentDueDate,
    revenueStatus,
    invoiceNumber,
    paymentDate,
    amountReceived,
    notes,
    createdAt
  }
`);

export const candidateByIdQuery = defineQuery(`
  *[_type == "candidate" && _id == $id][0] {
    _id,
    fullName,
    email,
    phone,
    alternateEmail,
    alternatePhone,
    primarySkill,
    skills,
    experience,
    currentSalary,
    expectedSalary,
    noticePeriod,
    status,
    currentCompany,
    currentDesignation,
    currentLocation,
    highestEducation,
    remotePreference,
    willingToRelocate,
    preferredLocations,
    languages,
    linkedInUrl,
    "location": currentLocation,
    source,
    lastContactedAt,
    nextFollowUpAt,
    "assignedRecruiter": assignedRecruiter->{ _id, name },
    notes,
    createdAt
  }
`);

export const vendorByIdQuery = defineQuery(`
  *[_type == "vendor" && _id == $id][0] {
    _id,
    companyName,
    legalName,
    industry,
    website,
    status,
    stateTaxRegistrations[]{
      state,
      branchName,
      gstin,
      pan,
      isPrimary
    },
    contacts[]{
      name,
      designation,
      email,
      phone,
      isPrimary,
      isActive
    },
    "primaryContact": coalesce(
      contacts[isPrimary == true][0].name,
      contacts[0].name
    ),
    "contactDesignation": coalesce(
      contacts[isPrimary == true][0].designation,
      contacts[0].designation
    ),
    "contactEmail": coalesce(
      contacts[isPrimary == true][0].email,
      contacts[0].email
    ),
    "contactPhone": coalesce(
      contacts[isPrimary == true][0].phone,
      contacts[0].phone
    ),
    billingEmail,
    billingAddress,
    feeModel,
    agreementFeePercentage,
    paymentTerms,
    msaStartDate,
    msaEndDate,
    leadSource,
    notes,
    createdAt
  }
`);

export const teamMemberByIdQuery = defineQuery(`
  *[_type == "teamMember" && _id == $id][0] {
    _id,
    employeeCode,
    name,
    legalName,
    email,
    phone,
    alternatePhone,
    role,
    specializations,
    isActive,
    workStatus,
    joinedAt,
    leftAt,
    salary,
    incentivePercentage,
    residentialAddress,
    notes
  }
`);

export const placementsByCandidateQuery = defineQuery(`
  *[_type == "placement" && candidate._ref == $candidateId] | order(placementDate desc) {
    _id,
    "candidate": candidate->{ _id, fullName, primarySkill },
    "vendor": vendor->{ _id, companyName },
    "recruiter": recruiter->{ _id, name },
    jobTitle,
    baseSalary,
    feePercentage,
    gstPercentage,
    feeAmount,
    gstAmount,
    totalInvoiceValue,
    placementDate,
    probationEndDate,
    exitDate,
    paymentDueDate,
    revenueStatus,
    invoiceNumber,
    paymentDate,
    amountReceived,
    notes,
    createdAt
  }
`);

export const placementsByVendorQuery = defineQuery(`
  *[_type == "placement" && vendor._ref == $vendorId] | order(placementDate desc) {
    _id,
    "candidate": candidate->{ _id, fullName, primarySkill },
    "vendor": vendor->{ _id, companyName },
    "recruiter": recruiter->{ _id, name },
    jobTitle,
    baseSalary,
    feePercentage,
    gstPercentage,
    feeAmount,
    gstAmount,
    totalInvoiceValue,
    placementDate,
    probationEndDate,
    exitDate,
    paymentDueDate,
    revenueStatus,
    invoiceNumber,
    paymentDate,
    amountReceived,
    notes,
    createdAt
  }
`);

export const placementsByRecruiterQuery = defineQuery(`
  *[_type == "placement" && recruiter._ref == $recruiterId] | order(placementDate desc) {
    _id,
    "candidate": candidate->{ _id, fullName, primarySkill },
    "vendor": vendor->{ _id, companyName },
    "recruiter": recruiter->{ _id, name },
    jobTitle,
    baseSalary,
    feePercentage,
    gstPercentage,
    feeAmount,
    gstAmount,
    totalInvoiceValue,
    placementDate,
    probationEndDate,
    exitDate,
    paymentDueDate,
    revenueStatus,
    invoiceNumber,
    paymentDate,
    amountReceived,
    notes,
    createdAt
  }
`);

export const settingsQuery = defineQuery(`*[_type == "settings" && language == $language][0] {
  ...,
}`);
