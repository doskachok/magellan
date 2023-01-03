const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getDownloadFileUrl = (fileId: string | undefined) : string | null => {
  return fileId ? `${BASE_URL}storage/${fileId}` : null;
};
