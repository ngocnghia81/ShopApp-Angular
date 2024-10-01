import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { OrderDto } from '../../../dtos/order/order.dto';
import { Order } from '../../../models/Order';
import { ProductResponseList } from '../../../responses/ProductResponseList';
import { OrderResponse } from '../../../responses/OrderResponse';
import { Observable } from 'rxjs';
import {OrderTableComponent} from "./order-table/order-table.component";

@Component({
  selector: 'app-order-admin',
  templateUrl: './order-admin.component.html',
  styleUrls: ['./order-admin.component.scss'],
  imports: [
    OrderTableComponent
  ],
  standalone: true
})
export class OrderAdminComponent implements OnInit {
  orders: OrderResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  keyword: string = '';
  visiblePages: number[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
    console.log(this.orders);
  }

  getAllOrders(keyword: string, page: number, limit: number): void {
    this.orderService.getOrders(keyword, page, limit).subscribe(
      {
        next: (response: any) => {
          debugger;
          this.orders = response.orderResponses;
          this.totalPages = response.totalPages;
          this.gennerateVisiblePage(this.currentPage, this.totalPages);
        },
      },
      {
        error: (error: any) => {
          console.log(error);
        },
      },
    );
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  gennerateVisiblePage(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages: number = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      const diff = maxVisiblePages - (endPage - startPage);
      startPage = Math.max(1, startPage - diff);
      endPage = Math.min(totalPages, endPage + diff);
    }

    return (this.visiblePages = Array(endPage - startPage + 1)
      .fill(0)
      .map((x, i) => i + startPage));
  }
}
