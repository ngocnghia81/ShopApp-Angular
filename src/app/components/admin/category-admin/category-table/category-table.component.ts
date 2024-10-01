import { Component, Input } from '@angular/core';
import { Category } from '../../../../models/Category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.scss'],
  standalone: true
})
export class CategoryTableComponent {
  @Input() categories!: Category[];

  constructor(private router: Router) {}

  deleteProduct(id: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this category?',
    );
    if (confirmDelete) {
      this.categories = this.categories.filter(
        (category) => category.id !== id,
      );
    }
  }

  navigateToProductDetail(id: number) {
    this.router.navigate([`category/${id}`]);
  }
}
