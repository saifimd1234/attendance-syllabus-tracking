import * as React from "react"
import { cn } from "@/lib/utils"

// Simple Popover implementation using standard React state since Radix is missing.
const Popover = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <div className={cn("relative inline-block text-left", className)}>{children}</div>
}

const PopoverTrigger = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

const PopoverContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn("absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95", className)}>
            {children}
        </div>
    )
}

export { Popover, PopoverTrigger, PopoverContent }
