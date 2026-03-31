import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { ErrorMessage, ShowNotification } from "../../Attribute";
import { HTTP_STATUS, ROUTES } from "../../Constants";
import { getAuthHeader, Storage } from "../../Utils";

let isRedirecting = false;

export async function Get<T>(url: string, params?: any, headers?: Record<string, string>): Promise<T> {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/'; // Default backup
  const config: AxiosRequestConfig = {
    method: "GET",
    headers: {
      ...getAuthHeader(),
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ...headers,
    },
    params,
  };

  try {
    const response = await axios.get<T>(BASE_URL + url, config);

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
