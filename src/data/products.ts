// Product categories
export type ProductCategory = 
  | "Helados" 
  | "Paletas de Hielo" 
  | "Bebidas Frias" 
  | "Bebidas Calientes" 
  | "Postres" 
  | "Salados" 
  | "Galletas";

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
}

// Import products from JSON file
import productsData from './products.json';

// Export typed products array
export const products: Product[] = productsData as Product[];

