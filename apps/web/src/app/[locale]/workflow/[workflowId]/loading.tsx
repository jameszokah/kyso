import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowLoading() {
  return (
    <div className="relative h-screen w-full">
      {/* Header skeleton */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* Canvas skeleton */}
      <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
        <div className="space-y-4 text-center">
          {/* Node skeletons arranged in a flow pattern */}
          <div className="flex items-center justify-center gap-16">
            <Skeleton className="h-24 w-48 rounded-xl" />
            <div className="h-px w-12 bg-border" />
            <Skeleton className="h-24 w-48 rounded-xl" />
            <div className="h-px w-12 bg-border" />
            <Skeleton className="h-24 w-48 rounded-xl" />
          </div>

          {/* Loading text */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary/50" />
              <div
                className="h-2 w-2 animate-pulse rounded-full bg-primary/50"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="h-2 w-2 animate-pulse rounded-full bg-primary/50"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <p className="text-muted-foreground text-sm">Loading workflow...</p>
          </div>
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div className="absolute top-0 bottom-0 left-0 w-64 border-r bg-background p-4">
        <Skeleton className="mb-6 h-10 w-full rounded-md" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
