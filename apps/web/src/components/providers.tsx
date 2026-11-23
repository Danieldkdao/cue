import { Toaster } from "./ui/toast";
import { TooltipProvider } from "./ui/tooltip";
import { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <NuqsAdapter>
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </NuqsAdapter>
  );
};
