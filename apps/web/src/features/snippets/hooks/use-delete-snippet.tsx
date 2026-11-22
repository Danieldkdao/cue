import { toast } from "@/components/ui/toast";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteSnippetAction } from "../actions/actions";

export const useDeleteSnippet = (snippetId: string) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { confirm, ConfirmationDialog } = useConfirm(
    "Confirm Deletion",
    "Are you sure you want to delete this snippet? This action is permanent and cannot be undone.",
  );

  const handleDeletion = async () => {
    const confirmation = await confirm();
    if (!confirmation) return;

    startTransition(async () => {
      const response = await deleteSnippetAction(snippetId);
      toast.add({
        type: response.error ? "error" : "success",
        title: response.message,
      });
      if (!response.error) {
        router.refresh();
      }
    });
  };

  return {
    handleDeletion,
    isDeletionPending: isPending,
    DeletionConfirmationDialog: ConfirmationDialog,
  };
};
