export interface Product {
  ID: number;
  Name: string;
  Price: number;
  Stock: number;
  CategoryID?: number;
  BrandID?: number;
  Image?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  // Change UpdatedBy to UpdateBy to match what ProductRow expects
  UpdateBy?: string;
}

export interface ProductRes {
  ID: number;
  Name: string;
  Price: number;
  Stock: number;
  CategoryID?: number;
  BrandID?: number;
  ImageURL?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  // Change UpdatedBy to UpdateBy to match what ProductRow expects
  UpdateBy?: string;
}

export interface ProductResponse {
  data: ProductRes[];
  count: number;
}

export interface Category {
  ID: number;
  Name: string;
}
