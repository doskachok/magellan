const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getDownloadFileUrl = (fileId: string) => {
  return `${BASE_URL}storage/${fileId}`;
};
