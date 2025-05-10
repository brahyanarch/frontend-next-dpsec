import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
const SkeletonTable: React.FC = () => {
    return (
        <>
        <div className="p-6 space-y-6">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 text-sm">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />

            {/* New button skeleton */}
            <Button variant="outline" disabled className="gap-2">
              <Skeleton className="h-4 w-12" />
            </Button>
          </div>

          {/* Table skeleton */}
          <div className="rounded-lg border">
            {/* Header */}
            <div className="grid grid-cols-[100px_1fr_100px] bg-muted p-4 gap-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Table row */}
            <div className="grid grid-cols-[100px_1fr_100px] p-4 gap-4 items-center">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Pagination skeleton */}
          <div className="flex justify-center gap-2 mt-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </>
    );
};

export default SkeletonTable;