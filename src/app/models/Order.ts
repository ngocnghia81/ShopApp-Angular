import { OrderDetail } from './OrderDetail';

export class Order {
  id?: number;
  user?: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  note?: string;
  orderDate?: Date;
  status?: string;
  totalMoney?: number;
  shippingMethod?: string;
  shippingAddress?: string;
  shippingDate?: Date;
  trackingNumber?: string;
  paymentMethod?: string;
  active?: boolean; // thuộc về admin
  orderDetail?: OrderDetail[];

  constructor(
    id?: number,
    user?: number,
    fullName?: string,
    email?: string,
    phoneNumber?: string,
    address?: string,
    note?: string,
    orderDate?: Date,
    status?: string,
    totalMoney?: number,
    shippingMethod?: string,
    shippingAddress?: string,
    shippingDate?: Date,
    trackingNumber?: string,
    paymentMethod?: string,
    active?: boolean,
    orderDetail?: OrderDetail[],
  ) {
    this.id = id;
    this.user = user;
    this.fullName = fullName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.note = note;
    this.orderDate = orderDate;
    this.status = status;
    this.totalMoney = totalMoney;
    this.shippingMethod = shippingMethod;
    this.shippingAddress = shippingAddress;
    this.shippingDate = shippingDate;
    this.trackingNumber = trackingNumber;
    this.paymentMethod = paymentMethod;
    this.active = active;
    this.orderDetail = orderDetail;
  }
}
