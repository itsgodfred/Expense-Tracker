import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonText() {
  return (
    <div className="flex h-full w-full flex-col gap-4 pt-10 px-5 overflow-x-hidden ">
      <Skeleton className="h-4 w-[25rem]" />
      <Skeleton className="h-4 w-[15rem]" />
      <Skeleton className="h-4 w-[10rem]" />

      <div className="grid grid-cols-3 w-full h-full gap-4 max-[920px]:grid-cols-1 max-[920px]:gap-5">
        <Skeleton className="h-[8rem] w-full" />
        <Skeleton className="h-[8rem] w-full" />
        <Skeleton className="h-[8rem] w-full" />
      </div>

      <div className="grid grid-cols-2 w-full h-full px-2 gap-4 max-[920px]:grid-cols-1">
        <Skeleton className="h-[20rem]" />
        <Skeleton className="h-[20rem]" />
      </div>
    </div>
  );
}
