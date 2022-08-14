import mainApi from './api';

const API_URL = `storage`;

export const fileStorageApi = mainApi.injectEndpoints({
  endpoints: (build => ({
    uploadFile: build.mutation<{ id: string }, File>({
      query: (file: File) => {
        const form = new FormData();
        form.append('file', file, file.name);

        return ({
          url: API_URL,
          method: 'POST',
          body: form,
        });
      },
    })
  }))
});

export const {
  useUploadFileMutation
} = fileStorageApi;
