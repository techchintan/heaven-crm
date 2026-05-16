import {useCallback, useState} from "react";
import {useClient, useDocumentOperation} from "sanity";
import type {DocumentActionComponent, DocumentActionProps} from "sanity";

import {apiVersion} from "../env";
import {
  formatEmployeeCode,
  getNextEmployeeSequence,
  resolveEmployeeCode,
} from "../lib/employee-code";

async function fetchExistingEmployeeCodes(
  client: ReturnType<typeof useClient>,
  excludeId?: string,
): Promise<string[]> {
  const filter = excludeId
    ? `*[_type == "teamMember" && defined(employeeCode) && _id != $excludeId].employeeCode`
    : `*[_type == "teamMember" && defined(employeeCode)].employeeCode`;

  return client.fetch<string[]>(filter, excludeId ? {excludeId} : {});
}

export const AssignEmployeeCodePublishAction: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const {draft, published, id, type, onComplete} = props;
  const sanityClient = useClient({apiVersion});
  const {publish, patch} = useDocumentOperation(id, type);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = useCallback(async () => {
    setIsPublishing(true);

    try {
      const existingCode = resolveEmployeeCode(
        draft as Record<string, unknown> | null,
        published as Record<string, unknown> | null,
      );

      if (!existingCode) {
        // First publish only — assign the next available code
        const codes = await fetchExistingEmployeeCodes(sanityClient, id);
        const employeeCode = formatEmployeeCode(getNextEmployeeSequence(codes));
        patch.execute([{set: {employeeCode}}]);
        await new Promise((resolve) => setTimeout(resolve, 100));
      } else if (draft) {
        // Keep code on draft so publish does not drop a read-only field
        const draftCode =
          typeof draft.employeeCode === "string" ? draft.employeeCode.trim().toUpperCase() : "";
        if (draftCode !== existingCode) {
          patch.execute([{set: {employeeCode: existingCode}}]);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      publish.execute();
    } catch (error) {
      console.error("Error publishing team member:", error);
    } finally {
      setIsPublishing(false);
      onComplete();
    }
  }, [draft, published, id, patch, publish, onComplete, sanityClient]);

  if (type !== "teamMember") {
    return null;
  }

  const hasChanges = Boolean(draft);
  const publishBlocked = Boolean(publish.disabled);

  return {
    label: isPublishing ? "Publishing…" : "Publish",
    tone: "positive",
    disabled: !hasChanges || isPublishing || publishBlocked,
    onHandle: handlePublish,
  };
};
