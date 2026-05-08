import React from "react"

import { Skeleton } from "@/components/ui/skeleton"

const ContactsSkeleton = () => {
  return (
    <div className="flex flex-col w-full gap-y-3 min-h-[200px] min-w-11/12">
      <Skeleton className="bg-white w-full h-[160px] shadow-sm" />
      <Skeleton className="bg-white w-full h-[20px] shadow-sm" />
    </div>
  )
}

export default ContactsSkeleton
