import { Toaster } from "./ui/toast";
import { TooltipProvider } from "./ui/tooltip";
import { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <TooltipProvider>
      <Toaster />
      {children}
    </TooltipProvider>
  );
};
