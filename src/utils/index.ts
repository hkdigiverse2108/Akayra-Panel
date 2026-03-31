import { STORAGE_KEYS } from "../Constants/StorageKeys";

export const Stringify = (value: object): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
};

export const Storage = localStorage;

export const getToken = () => {
  return Storage.getItem(STORAGE_KEYS.TOKEN) || "";
};

export const getAuthHeader = () => {
  const token = getToken();
  if (!token) return {};
  
  // If token already has Bearer prefix, don't add it again
  const authValue = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  return { Authorization: authValue };
};

export const CleanParams = (params?: any): any | undefined => {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );
};

export const GenerateOptions = (data?: any[]) => {
  if (!data || !Array.isArray(data)) return [];

  return data.map((item) => {
    const label = item.name?.trim() || item.title?.trim() || item.fullName?.trim() || "Unnamed";

    return {
      value: item._id,
      label,
    };
  });
};
