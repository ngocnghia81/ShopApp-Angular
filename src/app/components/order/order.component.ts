import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import {FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import { OrderDto } from '../../dtos/order/order.dto';
import { Validator } from 'class-validator';
import { OrderService } from '../../services/order.service';
import {CommonModule, CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    CommonModule
  ],
  standalone: true
})
export class OrderComponent implements OnInit {
  cartItems: { product: Product; quantity: number }[] = [];
  couponCode: string = '';
  totalAmount: number = 0;
  receiverInfoForm: FormGroup;

  orderData: OrderDto = {
    user_id: 6,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    total_money: 0,
    shipping_method: '',
    payment_method: '',
    coupon_code: '',
    order_details: [],
    cart_items: [],
  };

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService,
  ) {
    this.receiverInfoForm = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(6)]],
      note: [''],
      shipping_method: ['', [Validators.required]],
      payment_method: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.cartItems = [];

    const cart: Map<string, number> = this.cartService.getCart();
    const productIds: string[] = Array.from(cart.keys());

    console.log(cart);
    debugger;

    const productIdNumbers: number[] = productIds.map(id => Number(id));

    this.productService
      .getProductsByIds(productIdNumbers)
      .subscribe({
        next: (products: Product[]) => {
          debugger;

          products.forEach((product) => {
            // Kiểm tra xem product.id có phải là undefined hay không
            if (product.id !== undefined) {
              const quantity = cart.get(product.id.toString());

              if (typeof quantity === 'number') {
                this.cartItems.push({
                  product: product,
                  quantity: quantity,
                });
              } else {
                console.warn(`Quantity for product ID ${product.id} is not a number`);
              }
            } else {
              console.warn('Product ID is undefined', product);
            }
          });
          this.calculateTotalAmount();
          console.log(this.cartItems);
        },
      });
  }



  calculateTotalAmount() {
    // Debug để kiểm tra cartItems
    debugger;
    console.log('Calculating total amount with cartItems:', this.cartItems);

    this.totalAmount = this.cartItems.reduce(
      (total: number, item: { product: Product; quantity: number }) => {
        const price = item.product.price ?? 0; // Cung cấp giá mặc định là 0 nếu price là undefined
        console.log(`Adding ${price} * ${item.quantity} to total`);
        return total + price * item.quantity;
      },
      0,
    );
  }


  applyCoupon() {
    if (this.couponCode) {
      // Mock coupon validation
      const discount = this.couponCode === 'DISCOUNT10' ? 0.1 : 0; // Example: 10% discount for a specific coupon
      this.totalAmount = this.totalAmount * (1 - discount);
    }
  }


  placeOrder() {
    if (this.cartItems.length === 0) {
      alert('Cart is empty!');
      return;
    }
    if (this.receiverInfoForm.valid) {
      this.orderData = {
        ...this.orderData,
        ...this.receiverInfoForm.value,
      };
      this.orderData.cart_items = this.cartItems.map((value) => {
        return {
          product_id: value.product.id,
          quantity: value.quantity,
        };
      });
      this.orderData.total_money = this.totalAmount;
      this.orderData.coupon_code = this.couponCode;

      this.orderService.createOrder(this.orderData).subscribe({
        next: (data) => {
          console.log(data);
          this.cartService.clearCart();
        },
      });
    }
  }

  decrementQuantity(item: { product: Product; quantity: number }) {
    item.quantity--;
  }

  incrementQuantity(item: { product: Product; quantity: number }) {
    item.quantity++;
  }

  deleteItemFromCart(item: { product: Product; quantity: number }) {
    debugger;

    // Kiểm tra xem item và item.product có tồn tại không
    if (!item || !item.product) {
      console.warn("Item or product is undefined");
      return; // Kết thúc nếu item không hợp lệ
    }

    // Gọi service để xóa sản phẩm khỏi giỏ hàng
    this.cartService.removeFromCart(item.product.id ?? 0);

    // Lọc các mặt hàng trong giỏ để xóa item
    this.cartItems = this.cartItems.filter(
      (it) => item.product.id !== it.product.id
    );

    // Tính toán tổng tiền
    if (this.cartItems.length === 0) {
      this.totalAmount = 0; // Nếu giỏ hàng rỗng, đặt totalAmount về 0
    } else {
      this.calculateTotalAmount(); // Nếu còn mặt hàng, tính lại tổng tiền
    }
  }

}
