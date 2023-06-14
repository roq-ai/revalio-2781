import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface OfferInterface {
  id?: string;
  material: string;
  volume: number;
  price: number;
  shipping: string;
  incoterm: string;
  payment_tranche: string;
  desired_grade: string;
  organization_id: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface OfferGetQueryInterface extends GetQueryInterface {
  id?: string;
  material?: string;
  shipping?: string;
  incoterm?: string;
  payment_tranche?: string;
  desired_grade?: string;
  organization_id?: string;
}
