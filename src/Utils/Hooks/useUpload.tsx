import axios from "axios";
import { Mutations } from "../../Api/Mutations";
import { Queries } from "../../Api/Queries";
import { useMutations } from "../../Api/ReactQuery";
import { KEYS, URL_KEYS } from "../../Constants";
import type { AppQueryOptions, ResponseParserWrapper } from "../../Types/Api";
import { getAuthHeader } from "../index";

export interface UploadItem {
  fileName?: string;
  mimeType?: string;
  size?: number;
  path?: string;
  url?: string;
}

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const getFileNameFromUrl = (value?: string) => {
  if (!value) return "";
  const clean = value.split("?")[0].replace(/\\/g, "/");
  const parts = clean.split("/");
  return safeDecode(parts[parts.length - 1] || "");
};

const getBackendOrigin = () => {
  const base = (import.meta.env.VITE_API_BASE_URL || "").trim();
  if (!base) return "";
  try {
    return new URL(base).origin;
  } catch {
    return "";
  }
};

const resolveUrl = (value?: string) => {
  if (!value) return value;
  const normalizedValue = value.replace(/\\/g, "/");
  const uploadsIndex = normalizedValue.toLowerCase().indexOf("/uploads/");
  if (uploadsIndex !== -1) {
    const tail = normalizedValue.slice(uploadsIndex);
    value = tail;
  }
  if (/^https?:\/\//i.test(value)) return value;
  const origin = getBackendOrigin();
  if (!origin) return value;

  const normalized = value.replace(/\\/g, "/");
  if (normalized.startsWith("/")) {
    return `${origin}${normalized}`;
  }
  return `${origin}/${normalized.replace(/^\/+/, "")}`;
};

export const normalizeUploadItems = (input: any): UploadItem[] => {
  if (!input) return [];
  const items = Array.isArray(input) ? input : [input];

  return items
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") {
        const url = resolveUrl(item);
        return { url, fileName: getFileNameFromUrl(url) };
      }

      const rawUrl = item.url || item.path || item.fileUrl;
      const url = resolveUrl(rawUrl);
      const fileName = item.fileName || (url ? getFileNameFromUrl(url) : "");
      return { ...item, url, path: item.path, fileName };
    })
    .filter(Boolean) as UploadItem[];
};

export const useUpload = () => {
  const uploadImage = Mutations.useUploadImage();
  const deleteImage = useMutations([KEYS.UPLOAD.BASE], (fileUrl: string) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const resolvedUrl = resolveUrl(fileUrl) || fileUrl;
    return axios
      .delete(BASE_URL + URL_KEYS.UPLOAD.IMAGE, {
        data: { fileUrl: resolvedUrl },
        headers: {
          ...getAuthHeader(),
        },
      })
      .then((response) => response.data);
  });

  const useGetAllImages = (folder?: string, options?: AppQueryOptions<ResponseParserWrapper<any>>) =>
    Queries.useGetAllUploadImages(undefined, {
      ...options,
      select: (response) => {
        const normalized = normalizeUploadItems((response as any)?.data);
        const filtered = folder
          ? normalized.filter((item) => {
              const value = item.url || item.path || "";
              return value.includes(`/${folder}/`) || value.includes(`\\${folder}\\`) || value.includes(folder);
            })
          : normalized;
        return { ...(response as any), data: filtered };
      },
    });

  return { uploadImage, deleteImage, useGetAllImages };
};
