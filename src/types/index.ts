export interface Order {
  id: string;
  clientName: string | null;
  status: string;
  orderNumber: number | null;
  quantities: number | null;
  price: number | null;
  totalPrice: number | null;
  createdAt: string;
}