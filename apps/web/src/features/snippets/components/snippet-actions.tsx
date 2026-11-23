"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SnippetSelectData } from "@/db/schema";
import { cn } from "cn";
import { EditIcon, EllipsisIcon, PinIcon, Trash2Icon } from "lucide-react";
import { useDeleteSnippet } from "../hooks/use-delete-snippet";
import { useUpdateSnippet } from "../hooks/use-update-snippet";

export const SnippetActions = ({ snippet }: { snippet: SnippetSelectData }) => {
  const { openUpdate, UpdateDialog, isUpdatePending, handleUpdate } =
    useUpdateSnippet(snippet);
  const { handleDeletion, isDeletionPending, DeletionConfirmationDialog } =
    useDeleteSnippet(snippet.id);

  const disabled = isDeletionPending || isUpdatePending;

  return (
    <>
      {UpdateDialog}
      {DeletionConfirmationDialog}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="relative cursor-pointer group">
              <span className="absolute -inset-2.5 rounded-xl cursor-pointer group-hover:bg-background/50" />
              <EllipsisIcon className="relative z-100 size-4 shrink-0" />
            </button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={disabled} onClick={openUpdate}>
            <EditIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="group"
            disabled={disabled}
            onClick={() => handleUpdate({ pinned: !snippet.pinned })}
          >
            <PinIcon
              className={cn(
                "text-muted-foreground",
                snippet.pinned &&
                  "fill-muted-foreground group-focus:fill-accent-foreground",
              )}
              aria-label="Pinned"
            />
            {snippet.pinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={disabled}
            onClick={handleDeletion}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
