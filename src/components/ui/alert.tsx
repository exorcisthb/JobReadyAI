import * as React from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "default" | "destructive";

const variantClasses: Record<AlertVariant, string> = {
  default: "",
  destructive: "border-destructive/50 text-destructive [&>svg]:text-destructive",
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  return <div className={cn("relative w-full rounded-lg border p-4", variantClasses[variant], className)} role="alert" {...props} />;
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
