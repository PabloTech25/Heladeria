export type ProductCategory =
  | "Bebidas"
  | "Reposteria y Snacks"
  | "Heladería"
  | "Salados"
  | "Completos";

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  ingredients?: string;
  size?: string;
  price: string;
  numericPrice: number;
  image: string;
  hasSizes?: boolean;
  prices?: {
    chico: { price: string; numericPrice: number };
    grande: { price: string; numericPrice: number };
  };
}

// Import products from JSON file
import productsData from './products.json';

// Export typed products array
export const products: Product[] = productsData as Product[];

