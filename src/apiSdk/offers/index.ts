import axios from 'axios';
import queryString from 'query-string';
import { OfferInterface, OfferGetQueryInterface } from 'interfaces/offer';
import { GetQueryInterface } from '../../interfaces';

export const getOffers = async (query?: OfferGetQueryInterface) => {
  const response = await axios.get(`/api/offers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createOffer = async (offer: OfferInterface) => {
  const response = await axios.post('/api/offers', offer);
  return response.data;
};

export const updateOfferById = async (id: string, offer: OfferInterface) => {
  const response = await axios.put(`/api/offers/${id}`, offer);
  return response.data;
};

export const getOfferById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/offers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOfferById = async (id: string) => {
  const response = await axios.delete(`/api/offers/${id}`);
  return response.data;
};
