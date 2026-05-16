/** Indian states and union territories (for GST / branch registration). */
export const indianStateOptions = [
  {title: "Andhra Pradesh", value: "andhra_pradesh"},
  {title: "Arunachal Pradesh", value: "arunachal_pradesh"},
  {title: "Assam", value: "assam"},
  {title: "Bihar", value: "bihar"},
  {title: "Chhattisgarh", value: "chhattisgarh"},
  {title: "Goa", value: "goa"},
  {title: "Gujarat", value: "gujarat"},
  {title: "Haryana", value: "haryana"},
  {title: "Himachal Pradesh", value: "himachal_pradesh"},
  {title: "Jharkhand", value: "jharkhand"},
  {title: "Karnataka", value: "karnataka"},
  {title: "Kerala", value: "kerala"},
  {title: "Madhya Pradesh", value: "madhya_pradesh"},
  {title: "Maharashtra", value: "maharashtra"},
  {title: "Manipur", value: "manipur"},
  {title: "Meghalaya", value: "meghalaya"},
  {title: "Mizoram", value: "mizoram"},
  {title: "Nagaland", value: "nagaland"},
  {title: "Odisha", value: "odisha"},
  {title: "Punjab", value: "punjab"},
  {title: "Rajasthan", value: "rajasthan"},
  {title: "Sikkim", value: "sikkim"},
  {title: "Tamil Nadu", value: "tamil_nadu"},
  {title: "Telangana", value: "telangana"},
  {title: "Tripura", value: "tripura"},
  {title: "Uttar Pradesh", value: "uttar_pradesh"},
  {title: "Uttarakhand", value: "uttarakhand"},
  {title: "West Bengal", value: "west_bengal"},
  {title: "Andaman and Nicobar Islands", value: "andaman_nicobar"},
  {title: "Chandigarh", value: "chandigarh"},
  {title: "Dadra and Nagar Haveli and Daman and Diu", value: "dadra_nagar_haveli_daman_diu"},
  {title: "Delhi", value: "delhi"},
  {title: "Jammu and Kashmir", value: "jammu_kashmir"},
  {title: "Ladakh", value: "ladakh"},
  {title: "Lakshadweep", value: "lakshadweep"},
  {title: "Puducherry", value: "puducherry"},
] as const;

export type IndianState = (typeof indianStateOptions)[number]["value"];

export const indianStateLabels: Record<string, string> = Object.fromEntries(
  indianStateOptions.map(({title, value}) => [value, title]),
);

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export function validateGstin(gstin: string | undefined): true | string {
  if (!gstin) return true;
  return GSTIN_REGEX.test(gstin) ? true : "Invalid GSTIN format";
}

export function validatePan(pan: string | undefined): true | string {
  if (!pan) return true;
  return PAN_REGEX.test(pan) ? true : "Invalid PAN format (e.g., ABCDE1234F)";
}
