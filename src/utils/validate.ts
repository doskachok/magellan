import * as yup from 'yup';

export const validate = (schema: yup.AnyObjectSchema, form: Object): Promise<any> => {
  return new Promise((resolve, reject) => {
    schema
      .validate(form, {abortEarly: false})
      .then(resolve)
      .catch(err => {
        const prettified = err.inner
          .reduce((acc: { [x: string]: string[]; }, item: { path: string | number; message: string; }) => {
              return {
                ...acc,
                [item.path]: acc[item.path] ? [...acc[item.path], item.message] : [item.message],
              };
            }, {});

        reject(prettified);
      });
  });
};
