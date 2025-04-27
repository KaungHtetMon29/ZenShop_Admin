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
  Amount: number;
  CreatedAt: string;
  Type: string;
  CardholderName: string;
  CardNumberLast4: string;
  ExpiryDate: string;
}

export interface Shipping {
  ID: number;
  OrderID: number;
  Address: string;
  FirstName: string;
  LastName: string;
  City: string;
  State: string;
  ZipCode: string;
  Country: string;
  Email: string;
  Phone: string;
  CreatedAt: string;
}

export interface ProductPerOrder {
  ID: number;
  OrderID: number;
  ProductID: number;
  CreatedAt: string;
  Quantity: number;
  Product?: Product;
}

export interface Product {
  ID: number;
  Name: string;
  Price: number;
  Stock?: number;
  ImageURL?: string;
}

export interface OrderResponse {
  data: Order[];
  count: number;
  page: number;
  limit: number;
}

export interface CheckoutRequest {
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    email?: string;
    phone: string;
  };
  payment: {
    cardholderName: string;
    cardNumberLast4: string;
    expiryDate: string;
  };
  order: {
    items: {
      id: number;
      name: string;
      price: number;
      quantity: number;
    }[];
    totalItems: number;
    subtotal: number;
    shippingFee: number;
    total: number;
  };
}
