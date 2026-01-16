export interface Product {
  id: number;
  name: string;
  price: string;
}

export interface Order {
  id: number;
  productName: string;
  status: string;
  date: string;
}