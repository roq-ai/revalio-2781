import * as yup from 'yup';

export const offerValidationSchema = yup.object().shape({
  material: yup.string().required(),
  volume: yup.number().integer().required(),
  price: yup.number().integer().required(),
  shipping: yup.string().required(),
  incoterm: yup.string().required(),
  payment_tranche: yup.string().required(),
  desired_grade: yup.string().required(),
  organization_id: yup.string().nullable().required(),
});
