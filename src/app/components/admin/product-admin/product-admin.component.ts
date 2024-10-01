import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Product } from '../../../models/Product';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.scss'],
  standalone: true
})
export class ProductAdminComponent implements OnInit {
  products!: Product[];
  currentPage: number = 1;
  itemsPerPage = 12;
  pages: number[] = [];
  totalPages: number = 0;
  keyword: string = '';
  visiblePages: number[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getAllProducts(this.keyword, this.currentPage, this.itemsPerPage);
    console.log(this.products);
  }

  getAllProducts(keyword: string, page: number, limit: number): void {
    this.productService.getProducts(keyword, 0, page, limit).subscribe(
      {
        next: (response: any) => {
          debugger;
          this.products = response.productResponseList;
          console.log(this.products);
          this.totalPages = response.totalPage;
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
    this.getAllProducts(this.keyword, this.currentPage, this.itemsPerPage);
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
