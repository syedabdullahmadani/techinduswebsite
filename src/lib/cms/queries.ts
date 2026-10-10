import { queryOptions } from "@tanstack/react-query";
import { getPublicContent, adminContent } from "./functions";
export const publicContentOptions = queryOptions({
  queryKey: ["public-content"],
  queryFn: () => getPublicContent(),
  staleTime: 0,
  refetchInterval: 30000,
});
export const adminContentOptions = queryOptions({
  queryKey: ["admin-content"],
  queryFn: () => adminContent(),
  staleTime: 0,
});
