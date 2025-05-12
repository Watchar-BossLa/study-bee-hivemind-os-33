
import React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  heading: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  heading,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
      {description && (
        <p className="text-muted-foreground">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
