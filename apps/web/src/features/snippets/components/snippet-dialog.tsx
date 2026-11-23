"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SnippetSelectData } from "@/db/schema";
import { ReactElement, useState } from "react";
import { SnippetForm } from "./snippet-form";

export const SnippetDialog = ({
  open,
  onOpenChange,
  children,
  existingSnippet,
}: {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  children?: ReactElement;
  existingSnippet?: SnippetSelectData;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openToUse = open ?? isOpen;
  const setOpenToUse = onOpenChange ?? setIsOpen;

  return (
    <Dialog open={openToUse} onOpenChange={setOpenToUse}>
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {existingSnippet ? "Update" : "Create"} Snippet
          </DialogTitle>
        </DialogHeader>
        <SnippetForm
          existingSnippet={existingSnippet}
          afterAction={() => setOpenToUse(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
