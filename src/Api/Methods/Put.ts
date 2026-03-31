import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { ErrorMessage, ShowNotification } from "../../Attribute";
import { HTTP_STATUS, ROUTES } from "../../Constants";
import { getAuthHeader, Storage } from "../../Utils";

let isRedirecting = false;

export async function Put<T>(url: string, data?: any, headers?: Record<string, string>): Promise<T> {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4555/api/v1';
  const config: AxiosRequestConfig = {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
      ...headers,
    },
  };

  try {
    const response = await axios.put<T>(BASE_URL + url, data, config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status?: string }>;
    if (axiosError?.response?.status === HTTP_STATUS.UNAUTHORIZED && !isRedirecting) {
      Storage.clear();
      isRedirecting = true;
      window.location.href = ROUTES.LOGIN;
      setTimeout(() => (isRedirecting = false), 1000);
    } else {
      ShowNotification(ErrorMessage(error), "error");
    }
    throw error;
  }
}
