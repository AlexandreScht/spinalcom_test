import * as yup from 'yup';

export const idValidator = yup.number()
    .test(
      'len',
      'The number must be exactly 8 digits long',
      val => val && val.toString().length === 8
    )