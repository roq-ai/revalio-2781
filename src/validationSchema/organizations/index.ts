import * as yup from 'yup';
import { offerValidationSchema } from 'validationSchema/offers';

export const organizationValidationSchema = yup.object().shape({
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  offer: yup.array().of(offerValidationSchema),
});
