import {useEffect, useState, useCallback} from "react";
import {DocumentActionComponent, DocumentActionProps, useDocumentOperation} from "sanity";

/**
 * Calculate all derived fields for a placement document
 */
function calculatePlacementValues(draft: Record<string, unknown>) {
  const baseSalary = (draft.baseSalary as number) || 0;
  const feePercentage = (draft.feePercentage as number) || 8.33;
  const gstPercentage = 18; // Fixed at 18%

  // Calculate fee and GST amounts
  const feeAmount = Math.round(baseSalary * (feePercentage / 100));
  const gstAmount = Math.round(feeAmount * (gstPercentage / 100));
  const totalInvoiceValue = feeAmount + gstAmount;

  // Calculate dates
  let probationEndDate: string | undefined;
  let invoiceDate: string | undefined;
  let paymentDueDate: string | undefined;

  if (draft.placementDate) {
    const placementDate = new Date(draft.placementDate as string);

    // Probation end date: placement date + 90 days
    const probationEnd = new Date(placementDate);
    probationEnd.setDate(probationEnd.getDate() + 90);
    probationEndDate = probationEnd.toISOString().split("T")[0];

    // Invoice date: 1st of the month following placement
    const invoiceDateObj = new Date(placementDate.getFullYear(), placementDate.getMonth() + 1, 1);
    invoiceDate = invoiceDateObj.toISOString().split("T")[0];

    // Payment due date: invoice date + 30 days (default payment terms)
    const paymentDueDateObj = new Date(invoiceDateObj);
    paymentDueDateObj.setDate(paymentDueDateObj.getDate() + 30);
    paymentDueDate = paymentDueDateObj.toISOString().split("T")[0];
  }

  // Determine revenue status based on exit date
  let derivedStatus = (draft.revenueStatus as string) || "pending";

  if (draft.exitDate && draft.placementDate) {
    const exitDate = new Date(draft.exitDate as string);
    const placementDate = new Date(draft.placementDate as string);
    const probationEnd = new Date(placementDate);
    probationEnd.setDate(probationEnd.getDate() + 90);

    // If exit date is before probation end, mark as deducted
    if (exitDate < probationEnd) {
      derivedStatus = "deducted";
    }
  }

  // If payment date exists and status isn't deducted, mark as paid
  if (draft.paymentDate && derivedStatus !== "deducted") {
    derivedStatus = "paid";
  }

  return {
    feeAmount,
    gstAmount,
    totalInvoiceValue,
    probationEndDate,
    invoiceDate,
    paymentDueDate,
    revenueStatus: derivedStatus,
    gstPercentage,
  };
}

/**
 * Custom Publish action that calculates fields before publishing
 */
export const CalculateAndPublishAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {draft, published, id, type, onComplete} = props;
  const {publish, patch} = useDocumentOperation(id, type);
  const [isCalculating, setIsCalculating] = useState(false);

  // Only show for placement documents
  if (type !== "placement") {
    return null;
  }

  const handlePublish = useCallback(async () => {
    if (!draft) {
      // If no draft, just publish the existing document
      publish.execute();
      onComplete();
      return;
    }

    setIsCalculating(true);

    try {
      // Calculate all derived values
      const calculated = calculatePlacementValues(draft);

      // Patch the document with calculated values
      patch.execute([
        {
          set: {
            feeAmount: calculated.feeAmount,
            gstAmount: calculated.gstAmount,
            totalInvoiceValue: calculated.totalInvoiceValue,
            gstPercentage: calculated.gstPercentage,
            ...(calculated.probationEndDate && {
              probationEndDate: calculated.probationEndDate,
            }),
            ...(calculated.invoiceDate && {
              invoiceDate: calculated.invoiceDate,
            }),
            ...(calculated.paymentDueDate && {
              paymentDueDate: calculated.paymentDueDate,
            }),
            revenueStatus: calculated.revenueStatus,
          },
        },
      ]);

      // Small delay to ensure patch is applied
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Now publish
      publish.execute();
    } catch (error) {
      console.error("Error calculating placement fields:", error);
    } finally {
      setIsCalculating(false);
      onComplete();
    }
  }, [draft, patch, publish, onComplete]);

  // Check if there are changes to publish
  const hasChanges = Boolean(draft);

  return {
    label: isCalculating ? "Calculating..." : "Calculate & Publish",
    tone: "positive",
    disabled: !hasChanges || publish.disabled || isCalculating,
    onHandle: handlePublish,
  };
};

/**
 * Helper hook to auto-calculate fields in real-time as user types
 * This provides preview of calculated values before publishing
 */
export function useCalculatedPreview(draft: Record<string, unknown> | null) {
  const [preview, setPreview] = useState<ReturnType<typeof calculatePlacementValues> | null>(null);

  useEffect(() => {
    if (draft) {
      setPreview(calculatePlacementValues(draft));
    }
  }, [draft]);

  return preview;
}
