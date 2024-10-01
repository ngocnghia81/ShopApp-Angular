import { OrderDetail } from '../../models/OrderDetail';

export class OrderDto {
  user_id: number;
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  note: string;
  total_money: number;
  shipping_method: string;
  payment_method: string;
  order_details: OrderDetail[];
  cart_items: any[];
  coupon_code: string;

  constructor(data: any) {
    this.user_id = data.user_id;
    this.fullname = data.fullname;
    this.email = data.email;
    this.phone_number = data.phone_number;
    this.address = data.address;
    this.note = data.note;
    this.total_money = data.total_money;
    this.shipping_method = data.shipping_method;
    this.payment_method = data.payment_method;
    this.order_details = data.order_details;
    this.coupon_code = data.coupon_code;
    this.cart_items = data.cart_items;
  }
}
