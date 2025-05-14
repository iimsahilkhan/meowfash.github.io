"use client"

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface AccessibleDialogProps extends React.ComponentProps<typeof Dialog> {
  title: string;
  description?: string;
  children: React.ReactNode;
  contentProps?: React.ComponentProps<typeof DialogContent>;
}

/**
 * Accessible Dialog component that automatically includes the required DialogTitle for accessibility.
 * The title can be visually hidden but will still be available to screen readers.
 */
export function AccessibleDialog({
  title,
  description,
  children,
  contentProps,
  ...props
}: AccessibleDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent {...contentProps}>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {description && <DialogDescription className="sr-only">{description}</DialogDescription>}
        {children}
      </DialogContent>
    </Dialog>
  );
}