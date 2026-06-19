import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        idea: "bg-gray-100 text-gray-800",
        exploring: "bg-blue-100 text-blue-800",
        pending_decision: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-green-100 text-green-800",
        active: "bg-purple-100 text-purple-800",
        done: "bg-gray-200 text-gray-600",
        cancelled: "bg-red-100 text-red-800",
        archived: "bg-gray-100 text-gray-500",
      },
    },
    defaultVariants: {
      status: "idea",
    },
  }
);

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statusVariants> {
  status: "idea" | "exploring" | "pending_decision" | "confirmed" | "active" | "done" | "cancelled" | "archived";
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusVariants({ status }), className)} {...props}>
      {status.replace("_", " ")}
    </div>
  );
}
