import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../../../../responses/OrderResponse';
import { OrderService } from '../../../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-detail-admin',
  templateUrl: './order-detail-admin.component.html',
  styleUrls: ['./order-detail-admin.component.scss'],
  standalone: true
})
export class OrderDetailAdminComponent implements OnInit {
  orderResponse?: OrderResponse;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    const id: number = Number(this.activeRoute.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(id).subscribe(
      {
        next: (response: OrderResponse) => {
          debugger;
          this.orderResponse = response;
          console.log(response);
        },
      },
      {
        error: (error: any) => {
          console.log(error);
        },
      },
    );
  }

  save() {
    if (this.orderResponse) {
      this.orderService
        .updateOrder(this.orderResponse.id ? this.orderResponse.id : 0, this.orderResponse)
        .subscribe(
          {
            next: (response: OrderResponse) => {
              debugger;
              console.log(response);
              this.router.navigate(['../']);
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

  onStatusChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.orderResponse!.status = selectElement.value;
    console.log('Status changed to:', this.orderResponse!.status);
  }
}
