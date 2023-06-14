import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getOfferById, updateOfferById } from 'apiSdk/offers';
import { Error } from 'components/error';
import { offerValidationSchema } from 'validationSchema/offers';
import { OfferInterface } from 'interfaces/offer';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function OfferEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OfferInterface>(
    () => (id ? `/offers/${id}` : null),
    () => getOfferById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: OfferInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateOfferById(id, values);
      mutate(updated);
      resetForm();
      router.push('/offers');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<OfferInterface>({
    initialValues: data,
    validationSchema: offerValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Offer
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="material" mb="4" isInvalid={!!formik.errors?.material}>
              <FormLabel>Material</FormLabel>
              <Input type="text" name="material" value={formik.values?.material} onChange={formik.handleChange} />
              {formik.errors.material && <FormErrorMessage>{formik.errors?.material}</FormErrorMessage>}
            </FormControl>
            <FormControl id="volume" mb="4" isInvalid={!!formik.errors?.volume}>
              <FormLabel>Volume</FormLabel>
              <NumberInput
                name="volume"
                value={formik.values?.volume}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('volume', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.volume && <FormErrorMessage>{formik.errors?.volume}</FormErrorMessage>}
            </FormControl>
            <FormControl id="price" mb="4" isInvalid={!!formik.errors?.price}>
              <FormLabel>Price</FormLabel>
              <NumberInput
                name="price"
                value={formik.values?.price}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('price', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.price && <FormErrorMessage>{formik.errors?.price}</FormErrorMessage>}
            </FormControl>
            <FormControl id="shipping" mb="4" isInvalid={!!formik.errors?.shipping}>
              <FormLabel>Shipping</FormLabel>
              <Input type="text" name="shipping" value={formik.values?.shipping} onChange={formik.handleChange} />
              {formik.errors.shipping && <FormErrorMessage>{formik.errors?.shipping}</FormErrorMessage>}
            </FormControl>
            <FormControl id="incoterm" mb="4" isInvalid={!!formik.errors?.incoterm}>
              <FormLabel>Incoterm</FormLabel>
              <Input type="text" name="incoterm" value={formik.values?.incoterm} onChange={formik.handleChange} />
              {formik.errors.incoterm && <FormErrorMessage>{formik.errors?.incoterm}</FormErrorMessage>}
            </FormControl>
            <FormControl id="payment_tranche" mb="4" isInvalid={!!formik.errors?.payment_tranche}>
              <FormLabel>Payment Tranche</FormLabel>
              <Input
                type="text"
                name="payment_tranche"
                value={formik.values?.payment_tranche}
                onChange={formik.handleChange}
              />
              {formik.errors.payment_tranche && <FormErrorMessage>{formik.errors?.payment_tranche}</FormErrorMessage>}
            </FormControl>
            <FormControl id="desired_grade" mb="4" isInvalid={!!formik.errors?.desired_grade}>
              <FormLabel>Desired Grade</FormLabel>
              <Input
                type="text"
                name="desired_grade"
                value={formik.values?.desired_grade}
                onChange={formik.handleChange}
              />
              {formik.errors.desired_grade && <FormErrorMessage>{formik.errors?.desired_grade}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<OrganizationInterface>
              formik={formik}
              name={'organization_id'}
              label={'Select Organization'}
              placeholder={'Select Organization'}
              fetcher={getOrganizations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'offer',
  operation: AccessOperationEnum.UPDATE,
})(OfferEditPage);
