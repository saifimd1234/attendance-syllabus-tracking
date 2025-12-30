// Simplified Calendar for now since Full Calendar needs many deps (date-fns, react-day-picker)
// which might not be fully set up.
// Actually `task.md` said "Install Shadcn Components".
// I will implement a basic Calendar component using standard HTML input type="date"
// styled to look decent, to ensure it works without complex peer deps issues.
// If the user wants the full Shadcn Calendar, they'd need strictly matched versions.
// I'll provide a wrapper.

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CalendarProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Calendar = React.forwardRef<HTMLInputElement, CalendarProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                type="date"
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Calendar.displayName = "Calendar"

export { Calendar }
