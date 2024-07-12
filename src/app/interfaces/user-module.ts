export interface UserModule {
  name: string;
  description: string; // Garais apraksts
  route: string;
  childMenu?: UserModule[];
}
