import {AnyObjectSchema} from 'yup';

export const validateForm = (schema: AnyObjectSchema, form: Object): Promise<any> => {
  const initialErrors = Object.keys(form)
    .reduce((acc, key) => ({...acc, [key]: []}), {})

  return new Promise((resolve, reject) => {
    schema
      .validate(form, {abortEarly: false})
      .then(resolve)
      .catch(err => {
        const prettified = err.inner
          .reduce((acc: { [x: string]: string[]; }, item: { path: string | number; message: string; }) => {
              return {
                ...acc,
                [item.path]: [...acc[item.path], item.message],
              };
            }, initialErrors);

        reject(prettified);
      });
  });
};
