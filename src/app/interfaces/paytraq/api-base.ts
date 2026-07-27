import { stringToInt } from 'src/app/library';
import { PaytraqClients, PaytraqClient } from './client';
import { PaytraqProduct, PaytraqProducts } from './product';
import { z } from 'zod';

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

export const RequestOptionsSchema = z
  .object({
    page: stringToInt,
    query: z.string(),
  })
  .partial();
export type RequestOptions = z.infer<typeof RequestOptionsSchema>;
