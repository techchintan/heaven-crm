import {cn} from "@/lib/utils";

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DetailSection({title, children, className}: DetailSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider">{title}</h3>
      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function DetailField({label, value, className, fullWidth}: DetailFieldProps) {
  return (
    <div className={cn(fullWidth && "sm:col-span-2 lg:col-span-3", className)}>
      <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
      <dd className="text-foreground mt-1 text-sm">{value || <span className="text-muted-foreground">--</span>}</dd>
    </div>
  );
}
