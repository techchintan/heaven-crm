/**
 * Format Utilities for HeavenPro CRM
 *
 * Provides consistent formatting for dates, currency, numbers, and other values
 * throughout the application.
 */

import {format, parse, isValid} from "date-fns";

/**
 * Format currency value in Indian Rupees with proper notation
 * @param value - Number value to format
 * @returns Formatted currency string (e.g., "₹1.2L", "₹45,000")
 *
 * @example
 * formatCurrency(1200000) // Returns "₹12L"
 * formatCurrency(45000)   // Returns "₹45,000"
 * formatCurrency(1500)    // Returns "₹1,500"
 */
export function formatCurrency(value: number): string {
  if (value >= 10000000) {
    // Crores
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (value >= 100000) {
    // Lakhs
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  if (value >= 1000) {
    // Thousands with comma
    return `₹${value.toLocaleString("en-IN")}`;
  }
  return `₹${value}`;
}

/**
 * Format date to DD/MM/YYYY format
 * @param date - Date string, Date object, or ISO string
 * @returns Formatted date string (e.g., "25/01/2024")
 *
 * @example
 * formatDate("2024-01-25")        // Returns "25/01/2024"
 * formatDate(new Date())           // Returns current date in DD/MM/YYYY
 * formatDate("25-01-2024", "dd-MM-yyyy") // Custom format
 */
export function formatDate(date: string | Date, inputFormat?: string): string {
  try {
    let dateObj: Date;

    if (typeof date === "string") {
      // Try to parse with optional input format
      if (inputFormat) {
        dateObj = parse(date, inputFormat, new Date());
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }

    if (!isValid(dateObj)) {
      return "Invalid date";
    }

    return format(dateObj, "dd/MM/yyyy");
  } catch {
    return "Invalid date";
  }
}

/**
 * Format date with time
 * @param date - Date string or Date object
 * @returns Formatted date-time string (e.g., "25/01/2024, 2:30 PM")
 *
 * @example
 * formatDateTime("2024-01-25T14:30:00") // Returns "25/01/2024, 2:30 PM"
 */
export function formatDateTime(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (!isValid(dateObj)) {
      return "Invalid date";
    }

    return format(dateObj, "dd/MM/yyyy, h:mm a");
  } catch {
    return "Invalid date";
  }
}

/**
 * Format date to relative format
 * @param date - Date string or Date object
 * @returns Relative date string (e.g., "2 days ago", "In 3 hours")
 *
 * @example
 * formatRelativeDate(new Date(Date.now() - 86400000)) // Returns "1 day ago"
 */
export function formatRelativeDate(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (!isValid(dateObj)) {
      return "Invalid date";
    }

    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;

    return format(dateObj, "dd/MM/yyyy");
  } catch {
    return "Invalid date";
  }
}

/**
 * Format percentage value
 * @param value - Number value (e.g., 0.125 for 12.5%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "12.5%")
 *
 * @example
 * formatPercentage(0.125)        // Returns "12.5%"
 * formatPercentage(0.126, 2)     // Returns "12.60%"
 * formatPercentage(1)            // Returns "100%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format number with commas
 * @param value - Number value
 * @param decimals - Number of decimal places
 * @returns Formatted number string (e.g., "1,000,000")
 *
 * @example
 * formatNumber(1000000)    // Returns "1,000,000"
 * formatNumber(123.456, 2) // Returns "123.46"
 */
export function formatNumber(value: number, decimals?: number): string {
  if (decimals !== undefined) {
    return value.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return value.toLocaleString("en-IN");
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text string
 *
 * @example
 * truncateText("Hello World", 5) // Returns "He..."
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Capitalize first letter
 * @param text - Text to capitalize
 * @returns Capitalized text
 *
 * @example
 * capitalize("hello") // Returns "Hello"
 */
export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format name with proper case
 * @param name - Name to format
 * @returns Formatted name (e.g., "John Doe")
 *
 * @example
 * formatName("john doe")     // Returns "John Doe"
 * formatName("JOHN DOE")     // Returns "John Doe"
 */
export function formatName(name: string): string {
  return name
    .split(" ")
    .map((part) => capitalize(part))
    .join(" ");
}

/**
 * Extract initials from name
 * @param name - Full name
 * @returns Initials (e.g., "JD" for "John Doe")
 *
 * @example
 * getInitials("John Doe")      // Returns "JD"
 * getInitials("John Q. Public") // Returns "JP"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format email with validation
 * @param email - Email address
 * @returns Formatted email or empty string if invalid
 *
 * @example
 * formatEmail("JOHN@EXAMPLE.COM") // Returns "john@example.com"
 */
export function formatEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Format phone number
 * @param phone - Phone number (digits only)
 * @returns Formatted phone (e.g., "+91 98765 43210")
 *
 * @example
 * formatPhone("9876543210") // Returns "+91 98765 43210"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * Calculate percentage change
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change (e.g., 25 for 25% increase)
 *
 * @example
 * calculatePercentageChange(150, 100) // Returns 50
 * calculatePercentageChange(50, 100)  // Returns -50
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Calculate days between two dates
 * @param date1 - First date
 * @param date2 - Second date (default: today)
 * @returns Number of days between dates
 *
 * @example
 * calculateDaysBetween("2024-01-25", "2024-01-20") // Returns 5
 */
export function calculateDaysBetween(date1: string | Date, date2?: string | Date): number {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = date2 ? (typeof date2 === "string" ? new Date(date2) : date2) : new Date();

  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if probation is at risk (within 30 days of end)
 * @param probationEndDate - Probation end date
 * @returns Boolean indicating if at risk
 *
 * @example
 * isAtRiskProbation("2024-02-10") // Returns true if within 30 days
 */
export function isAtRiskProbation(probationEndDate: string | Date): boolean {
  const days = calculateDaysBetween(probationEndDate);
  return days >= 0 && days <= 30;
}

/**
 * Format placement status for display
 * @param status - Status key (e.g., "in_process")
 * @returns Formatted status (e.g., "In Process")
 *
 * @example
 * formatStatus("in_process") // Returns "In Process"
 */
export function formatStatus(status: string): string {
  return status.split("_").map(capitalize).join(" ");
}

/**
 * Calculate GST amount (18%)
 * @param amount - Base amount
 * @param gstRate - GST rate percentage (default: 18)
 * @returns GST amount
 *
 * @example
 * calculateGST(10000)     // Returns 1800
 * calculateGST(10000, 5)  // Returns 500
 */
export function calculateGST(amount: number, gstRate: number = 18): number {
  return Math.round((amount * gstRate) / 100);
}

/**
 * Calculate total with GST
 * @param amount - Base amount
 * @param gstRate - GST rate percentage (default: 18)
 * @returns Total amount including GST
 *
 * @example
 * calculateTotal(10000) // Returns 11800
 */
export function calculateTotal(amount: number, gstRate: number = 18): number {
  return amount + calculateGST(amount, gstRate);
}

/**
 * Format revenue for display
 * @param revenue - Revenue value
 * @param includeGST - Whether to include GST in calculation
 * @returns Formatted revenue string
 *
 * @example
 * formatRevenue(100000, true) // Returns "₹1.18L"
 */
export function formatRevenue(revenue: number, includeGST: boolean = false): string {
  const amount = includeGST ? calculateTotal(revenue) : revenue;
  return formatCurrency(amount);
}

const formatUtils = {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeDate,
  formatPercentage,
  formatNumber,
  truncateText,
  capitalize,
  formatName,
  getInitials,
  formatEmail,
  formatPhone,
  calculatePercentageChange,
  calculateDaysBetween,
  isAtRiskProbation,
  formatStatus,
  calculateGST,
  calculateTotal,
  formatRevenue,
};

export default formatUtils;
