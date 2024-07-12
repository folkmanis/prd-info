import { PaytraqClients, PaytraqClient } from './client';
import { PaytraqProduct, PaytraqProducts } from './product';

interface ClientData {
  client: PaytraqClient;
}

interface ClientsData {
  clients: PaytraqClients;
}

interface ProductData {
  product: PaytraqProduct;
}

interface ProductsData {
  products: PaytraqProducts;
}

export type PaytraqData = ClientData | ClientsData | ProductData | ProductsData;

export interface RequestOptions {
  page?: number;
  query?: string;
}
