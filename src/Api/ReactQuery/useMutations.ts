import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { ShowNotification, ErrorMessage } from "../../Attribute";
import type { CombinedErrorResponse } from "../../Types/Api";

export function useMutations<T, V, C = unknown>(
  queryKey: any[],
  callback: (variables: V) => Promise<T>,
  options?: UseMutationOptions<T, CombinedErrorResponse, V, C> & { showSuccessToast?: boolean }
) {
  const queryClient = useQueryClient();

  return useMutation<T, CombinedErrorResponse, V, C>({
    mutationFn: callback,
    onSuccess: (data: T, variables: V, context: C) => {
      // Automatically invalidate related queries if keys are provided
      if (queryKey && queryKey.length > 0) {
        queryKey.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }

      if ((data as any)?.message && options?.showSuccessToast !== false) {
        ShowNotification((data as any).message, "success");
      }
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
    onError: (error: CombinedErrorResponse, variables: V, context: C | undefined) => {
      ShowNotification(ErrorMessage(error), "error");
      if (options?.onError) {
        (options.onError as any)(error, variables, context);
      }
    },
    ...options,
  });
}
