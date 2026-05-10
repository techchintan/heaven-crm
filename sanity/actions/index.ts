import {DocumentActionComponent, DocumentActionsResolver} from "sanity";
import {CalculateAndPublishAction} from "./calculatePlacementFields";

/**
 * Resolve document actions for different document types
 * For placements, we add our custom Calculate & Publish action
 */
export const resolveDocumentActions: DocumentActionsResolver = (
  prev,
  context
) => {
  // For placement documents, replace the default publish with our custom action
  if (context.schemaType === "placement") {
    return prev.map((originalAction) => {
      // Replace the default publish action with our custom one
      if (originalAction.action === "publish") {
        return CalculateAndPublishAction;
      }
      return originalAction;
    });
  }

  // For all other document types, use default actions
  return prev;
};
