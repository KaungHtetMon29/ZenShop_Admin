export interface Order {
  ID: number;
  UserId: string;
  CreatedAt: string;
  UpdatedAt?: string;
  Payment: Payment;
  Shipping: Shipping;
  ProductPerOrder?: ProductPerOrder[];
}

export interface Payment {
  ID: number;
  OrderID: number;
  Method: string;
  Status: string;
  Amount: number;
}

export interface Shipping {
  ID: number;
  OrderID: number;
  Status: string;
  Address: string;
}

export interface ProductPerOrder {
  ID: number;
  OrderID: number;
  ProductID: number;
  CreatedAt: string;
  Product?: Product;
}

export interface Product {
  ID: number;
  Name: string;
  Price: number;
}

export interface OrderResponse {
  data: Order[];
  status: string;
  count: number;
}
