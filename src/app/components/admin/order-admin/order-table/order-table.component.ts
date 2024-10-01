import { Component, Input, OnInit } from '@angular/core';
import { OrderResponse } from '../../../../responses/OrderResponse';
import { Router } from '@angular/router';
import { OrderService } from '../../../../services/order.service';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss'],
  standalone: true
})
export class OrderTableComponent implements OnInit {
  @Input() orders: OrderResponse[] = [];

  constructor(
    private router: Router,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {}

  navigateToOrderDetail(id: number) {
    this.router.navigate([`/admin/orders/${id}`]);
  }

  deleteOrder(id: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this order?',
    );
    if (confirmDelete) {
      this.orderService.deleteOrder(id).subscribe(
        {
          next: (response: any) => {
            window.location.reload();
          },
        },
        {
          error: (error: any) => {
            console.log(error);
          },
        },
      );
    }
  }
}
