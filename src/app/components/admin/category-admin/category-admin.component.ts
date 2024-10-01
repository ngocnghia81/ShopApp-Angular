import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/Category';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category-admin.component.html',
  styleUrls: ['./category-admin.component.scss'],
  standalone: true
})
export class CategoryAdminComponent implements OnInit {
  categories!: Category[];
  keyword: string = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.getAllCategories();
    console.log(this.categories);
  }

  getAllCategories(): void {
    this.categoryService.getAllCategorys().subscribe(
      {
        next: (response: any) => {
          debugger;
          this.categories = response;
          console.log(this.categories);
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
