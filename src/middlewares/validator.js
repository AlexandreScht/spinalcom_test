import { ClientException,InvalidArgumentError } from '@/exceptions';
import { ObjectSchema,ValidationError } from 'yup';

const validator = (validators, values) => {
  if (!(validators instanceof ObjectSchema)) {
    throw new InvalidArgumentError('validators is not a Yup schema');
  }
  try {
    validators.validateSync(values);
    return;
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new InvalidArgumentError(`Keys < ${err.path} > ${err.message}`);
    }
    throw new ClientException(500, 'error on validation props');
  }
};

export default validator;
