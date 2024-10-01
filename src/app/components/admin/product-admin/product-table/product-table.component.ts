import { Component, Input } from '@angular/core';
import { Product } from '../../../../models/Product';
import { ProductService } from '../../../../services/product.service';
import { Router } from '@angular/router';
import { OrderService } from '../../../../services/order.service';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  imports: [
    DatePipe
  ],
  standalone: true
})
export class ProductTableComponent {
  @Input() products!: Product[];

  constructor(
    private productService: ProductService,
    private router: Router,
    private orderService: OrderService,
  ) {}

  deleteProduct(id:any) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this prodduct?',
    );
    if (confirmDelete) {
      this.productService.deleteProduct(id).subscribe(
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

  navigateToProductDetail(id:any) {
    console.log(this.products);
    this.router.navigate([`product/${id}`]);
  }

  navigateToOrders(id: number) {
    this.orderService.getOrdersByProductId(id).subscribe(
      {
        next: (response: any) => {
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
}
