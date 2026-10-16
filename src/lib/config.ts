export const API_BASE_URL = import.meta.env.REACT_APP_BASE_URL;

export const getFileUrl = (fileId?: string | null) => (fileId ? `${API_BASE_URL}storage/${fileId}` : undefined);

export const CURRENCIES = ['EUR', 'USD', 'UAH', 'GBP', 'PLN'] as const;
