import { idValidator } from '@/libs/validateShemas';
import * as yup from 'yup';

const createValidator = (object) => yup.object().shape(object);

export const roomSchemaValidator = createValidator({
  id: idValidator.required('id is a required props'),
});