export interface Product {
  ID: number;
  BrandID: number;
  Name: string;
  Price: number;
  Stock: number;
  CategoryID: number;
  CreatedAt: string;
  UpdatedAt: string;
  UpdateBy: string;
  ImageURL: string;
}

export interface Brand {
  ID: number;
  Name: string;
}

export interface ProductResponse {
  data: Product[];
  status: string;
  count: number;
}
