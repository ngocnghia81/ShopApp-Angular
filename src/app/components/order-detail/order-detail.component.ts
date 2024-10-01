import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/Product';
import { OrderService } from '../../services/order.service';
import { OrderDto } from '../../dtos/order/order.dto';
import { OrderDetail } from '../../models/OrderDetail';
import {CurrencyPipe, DecimalPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  imports: [
    DecimalPipe,
    CurrencyPipe,
    NgForOf
  ],
  standalone: true
})
export class OrderDetailComponent implements OnInit {
  orderResponse!: OrderDto;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  ngOnInit() {
    this.getOrderDetail();
  }

  getOrderDetail() {
    // Debug bạn kiểm tra cartItems
    debugger;
    const id: number = 18;
    this.orderService.getOrderById(id).subscribe(
      {
        next: (response: OrderDto) => {
          this.orderResponse = response;
          console.log(this.orderResponse);
        },
      },
      {
        error: (error: any) => {
          console.log(error);
        },
      },
    );
  }

  incrementQuantity(orderDetail: OrderDetail): void {
    if (orderDetail.numberOfProducts !== undefined) {
      orderDetail.numberOfProducts++;
      this.updateTotalMoney(orderDetail);
    }
  }

  decrementQuantity(orderDetail: OrderDetail): void {
    if (
      orderDetail.numberOfProducts !== undefined &&
      orderDetail.numberOfProducts > 0
    ) {
      orderDetail.numberOfProducts--;
      this.updateTotalMoney(orderDetail);
    }
  }

  updateTotalMoney(orderDetail: OrderDetail): void {
    if (
      orderDetail.price !== undefined &&
      orderDetail.numberOfProducts !== undefined
    ) {
      orderDetail.totalMoney = orderDetail.price * orderDetail.numberOfProducts;
      this.updateOrderTotal();
    }
  }


  updateOrderTotal(): void {
    this.orderResponse.total_money = this.orderResponse.order_details.reduce(
      (total, detail) => total + (detail.totalMoney || 0),
      0,
    );
  }

  applyCoupon() {
    // this.calculateTotalAmount();
  }
}
