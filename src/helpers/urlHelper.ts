const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getDownloadFileUrl = (fileId?: string) : string | null => {
  if (!fileId) return null;
  return `${BASE_URL}storage/${fileId}`;
};
