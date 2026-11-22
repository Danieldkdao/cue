import { SnippetSelectData } from "@/db/schema";
import { useState, useTransition } from "react";
import { SnippetDialog } from "../components/snippet-dialog";
import { PartialSnippetSchema } from "@cue/shared/schemas";
import { updateSnippetAction } from "../actions/actions";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export const useUpdateSnippet = (snippet: SnippetSelectData) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const openUpdate = () => {
    setOpen(true);
  };

  const handleUpdate = (updates: PartialSnippetSchema) => {
    startTransition(async () => {
      const response = await updateSnippetAction(snippet.id, updates);
      toast.add({
        type: response.error ? "error" : "success",
        title: response.message,
      });
      if (!response.error) {
        router.refresh();
      }
    });
  };

  const UpdateDialog = (
    <SnippetDialog
      open={open}
      onOpenChange={setOpen}
      existingSnippet={snippet}
    />
  );

  return { openUpdate, UpdateDialog, isUpdatePending: isPending, handleUpdate };
};
