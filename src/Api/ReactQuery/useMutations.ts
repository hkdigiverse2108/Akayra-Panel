import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { ShowNotification, ErrorMessage } from "../../Attribute";
import type { CombinedErrorResponse } from "../../Types/Api";

export function useMutations<T, V>(
  queryKey: any[],
  callback: (variables: V) => Promise<T>,
  options?: UseMutationOptions<T, CombinedErrorResponse, V>
) {
  const queryClient = useQueryClient();

  return useMutation<T, CombinedErrorResponse, V>({
    mutationFn: callback,
    onSuccess: (data: any, variables, context) => {
      // Automatically invalidate related queries if keys are provided
      if (queryKey && queryKey.length > 0) {
        queryKey.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }

      if (data?.message) {
        ShowNotification(data.message, "success");
      }
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      ShowNotification(ErrorMessage(error), "error");
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
}
