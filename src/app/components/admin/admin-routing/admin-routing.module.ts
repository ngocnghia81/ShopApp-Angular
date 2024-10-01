import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderAdminComponent } from '../order-admin/order-admin.component';
import { adminGuard } from '../../../guards/admin.guard';
import { ProductAdminComponent } from '../product-admin/product-admin.component';
import { CategoryAdminComponent } from '../category-admin/category-admin.component';
import { AdminComponent } from '../admin.component';
import { OrderDetailAdminComponent } from '../order-admin/order-detail-admin/order-detail-admin.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'orders',
        component: OrderAdminComponent,
      },
      {
        path: 'orders/:id',
        component: OrderDetailAdminComponent,
      },
      {
        path: 'products',
        component: ProductAdminComponent,
      },
      {
        path: 'categories',
        component: CategoryAdminComponent,
        canActivate: [adminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
