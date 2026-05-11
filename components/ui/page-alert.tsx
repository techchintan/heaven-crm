import {cn} from "@/lib/utils";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, CheckCircle2, AlertTriangle, InfoIcon} from "lucide-react";

interface PageAlertProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  className?: string;
  onDismiss?: () => void;
}

const alertConfig = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950",
    titleClassName: "text-emerald-900 dark:text-emerald-100",
    messageClassName: "text-emerald-800 dark:text-emerald-200",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950",
    titleClassName: "text-red-900 dark:text-red-100",
    messageClassName: "text-red-800 dark:text-red-200",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950",
    titleClassName: "text-amber-900 dark:text-amber-100",
    messageClassName: "text-amber-800 dark:text-amber-200",
  },
  info: {
    icon: InfoIcon,
    className: "border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950",
    titleClassName: "text-blue-900 dark:text-blue-100",
    messageClassName: "text-blue-800 dark:text-blue-200",
  },
};

/**
 * PageAlert Component
 *
 * Full-width alert for displaying page-level messages and feedback.
 * Built on shadcn Alert with semantic color variants.
 *
 * Types:
 * - success: Confirmation of successful actions
 * - error: Error or critical information
 * - warning: Warnings or cautionary information
 * - info: Informational messages
 *
 * @param type - Alert type/severity
 * @param title - Alert heading
 * @param message - Alert message
 * @param className - Additional CSS classes
 * @param onDismiss - Optional callback to dismiss alert
 *
 * @example
 * ```tsx
 * <PageAlert
 *   type="success"
 *   title="Placement Created"
 *   message="The new placement has been successfully created and invoiced."
 * />
 * ```
 */
export function PageAlert({type, title, message, className, onDismiss}: PageAlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <Alert className={cn(config.className, className)}>
      <Icon className="h-4 w-4" />
      <AlertTitle className={config.titleClassName}>{title}</AlertTitle>
      <AlertDescription className={config.messageClassName}>{message}</AlertDescription>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-auto text-xs opacity-70 hover:opacity-100">
          Dismiss
        </button>
      )}
    </Alert>
  );
}
