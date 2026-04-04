import { Mutations } from "../../Api/Mutations";
import { Queries } from "../../Api/Queries";
import type { AppQueryOptions, ResponseParserWrapper } from "../../Types/Api";

export interface UploadItem {
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}

const getUploadParams = (pathOrUrl?: string) => {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return { url: pathOrUrl };
  }
  return { path: pathOrUrl };
};

export const useUpload = () => {
  const uploadImage = Mutations.useUploadImage();
  const deleteImage = Mutations.useDeleteUploadedImage();
  const useGetUploadedImage = ( pathOrUrl?: string, options?: AppQueryOptions<ResponseParserWrapper<any>>) =>
    Queries.useGetUploadedImage(getUploadParams(pathOrUrl), { enabled: !!pathOrUrl, ...options });

  const useGetAllImages = (folder?: string, options?: AppQueryOptions<ResponseParserWrapper<any>>) => Queries.useGetAllUploadImages(folder ? { folder } : undefined, options);

  return { uploadImage, deleteImage, useGetUploadedImage, useGetAllImages };
};
