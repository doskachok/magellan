export interface IApiErrorResponse {
  data?: {
    errors?: Record<string, unknown>[],
  }
}

export type TApiErrorResponse = IApiErrorResponse | undefined;

export const getValidationErrorsFromApiResponse = (apiErrorResponse: TApiErrorResponse): Record<string, string> => {
  if (!apiErrorResponse || !apiErrorResponse?.data?.errors)
    return {};
  
  return Object.entries(apiErrorResponse.data.errors)
    .reduce((prev, [key, value]) => ({
      ...prev,
      [key]: value[0],
    }), {});
}
