import { OrderDetail } from '../models/OrderDetail';

export class OrderResponse {
  id?: number;
  user_id?: number;
  fullname?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  note?: string;
  status?: string;
  total_money?: number;
  shipping_method?: string;
  shipping_address?: string;
  shipping_date?: Date;
  payment_method?: string;
  order_details?: OrderDetail[];

  constructor(
    id?: number,
    userId?: number,
    fullName?: string,
    email?: string,
    phoneNumber?: string,
    address?: string,
    note?: string,
    status?: string,
    totalMoney?: number,
    shippingMethod?: string,
    shippingAddress?: string,
    shippingDate?: Date,
    paymentMethod?: string,
    orderDetails?: OrderDetail[],
  ) {
    this.id = id;
    this.user_id = userId;
    this.fullname = fullName;
    this.email = email;
    this.phone_number = phoneNumber;
    this.address = address;
    this.note = note;
    this.status = status;
    this.total_money = totalMoney;
    this.shipping_method = shippingMethod;
    this.shipping_address = shippingAddress;
    this.shipping_date = shippingDate;
    this.payment_method = paymentMethod;
    this.order_details = orderDetails;
  }
}
