import {DocumentActionsResolver} from "sanity";
import {AssignEmployeeCodePublishAction} from "./assignEmployeeCode";
import {CalculateAndPublishAction} from "./calculatePlacementFields";

/**
 * Resolve document actions for different document types
 */
export const resolveDocumentActions: DocumentActionsResolver = (prev, context) => {
  if (context.schemaType === "placement") {
    return prev.map((originalAction) => {
      if (originalAction.action === "publish") {
        return CalculateAndPublishAction;
      }
      return originalAction;
    });
  }

  if (context.schemaType === "teamMember") {
    return prev.map((originalAction) => {
      if (originalAction.action === "publish") {
        return AssignEmployeeCodePublishAction;
      }
      return originalAction;
    });
  }

  return prev;
};
