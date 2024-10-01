import { Order } from './Order';
import { Product } from './Product';

export class OrderDetail {
  id?: number;
  order?: Order;
  product?: Product;
  price?: number;
  numberOfProducts?: number;
  totalMoney?: number;
  color?: string;

  constructor(
    id?: number,
    order?: Order,
    product?: Product,
    price?: number,
    numberOfProducts?: number,
    totalMoney?: number,
    color?: string,
  ) {
    this.id = id;
    this.order = order;
    this.product = product;
    this.price = price;
    this.numberOfProducts = numberOfProducts;
    this.totalMoney = totalMoney;
    this.color = color;
  }
}
