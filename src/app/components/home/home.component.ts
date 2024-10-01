import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductResponseList } from '../../responses/ProductResponseList';
import { ProductResponse } from '../../responses/ProductResponse';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from "@angular/forms";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, of, Subject } from 'rxjs';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faStar, faStarHalfAlt} from "@fortawesome/free-solid-svg-icons"; // Add imports


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    FormsModule,
    NgClass,
    CommonModule,
    FaIconComponent
  ],
  standalone: true,
  host: {ngSkipHydration: 'true'},
})
export class HomeComponent implements OnInit {

  id!: number;
  products?: ProductResponse[] = [];
  currentPage: number = 1;
  itemPerPage: number = 12;
  pages: number[] = [];
  totalPages?: number = 0;
  visiblePages: number[] = [];
  categories: Category[] = [];
  keyword: string = '';
  selectedCategory: number = 0;

  protected readonly faStar = faStar;
  protected readonly faStarHalfAlt = faStarHalfAlt;

  private searchSubject: Subject<string> = new Subject(); // Debounce search input

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(keyword => {
      this.searchProducts();
    });

    this.getProducts(
      this.keyword,
      this.selectedCategory,
      this.currentPage,
      this.itemPerPage,
    );
    this.loadCategories();
  }

  // Fetch categories from the service
  loadCategories() {
    this.categoryService.getAllCategorys().pipe(
      catchError(error => {
        console.log("Error fetching categories:", error);
        return of([]); // Return an empty array on error
      })
    ).subscribe((response: Category[]) => {
      this.categories = response;
    });
  }

  // Search products using debounced keyword input
  onKeywordChange() {
    this.searchSubject.next(this.keyword); // Trigger search
  }

  searchProducts() {
    this.getProducts(
      this.keyword,
      this.selectedCategory,
      this.currentPage,
      this.itemPerPage,
    );
  }

  getProducts(
    keyword: string,
    categoryId: number,
    page: number,
    limit: number,
  ) {
    this.productService.getProducts(keyword, categoryId, page, limit).pipe(
      catchError(error => {
        console.log("Error fetching products:", error);
        return of({ productResponseList: [], totalPage: 0 }); // Return empty on error
      })
    ).subscribe((response: ProductResponseList) => {
      this.products = response.productResponseList;
      this.totalPages = response.totalPage;
      this.generateVisiblePage(this.currentPage, this.totalPages ?? 0);
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getProducts(
      this.keyword,
      this.selectedCategory,
      this.currentPage,
      this.itemPerPage,
    );
  }

  // Corrected typo: 'generateVisiblePage'
  generateVisiblePage(currentPage: number, totalPages: number): number[] {
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

  onProductClick(productId: number) {
    this.router.navigate(['/product', productId]);
  }


}
