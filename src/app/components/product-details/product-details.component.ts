import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { ProductImage } from '../../models/ProductImage';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  imports: [
    NgClass,
    NgForOf
  ],
  standalone: true
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  productImages?: ProductImage[];
  productId!: number;
  currentIndexImage: number = 0;
  quantity: number = 1;

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.productId = this.activeRoute.snapshot.params['id'];

    this.productService.getDetailProduct(this.productId).subscribe(
      {
        next: (response: Product) => {
          this.product = response;
          console.log(this.product);
          this.productService.getProductImages(this.productId).subscribe(
            {
              next: (response: ProductImage[]) => {
                this.productImages = response;
                console.log(this.productImages);
              },
            },
            {
              error: (error: any) => {
                console.log(error);
              },
            },
          );
        },
      },
      (error: any) => {
        console.log(error);
      },
    );
  }

  showImage(index: number) {
    if (this.productImages && this.product && this.productImages.length > 0) {
      if (index < 0) {
        index = 0;
      } else if (index >= this.productImages.length) {
        index = this.productImages.length - 1;
      }
      this.currentIndexImage = index;
    }
  }

  nextImage() {
    if (this.currentIndexImage < this.productImages?.length! - 1) {
      this.showImage(this.currentIndexImage + 1);
    } else {
      this.showImage(0);
    }
  }

  previousImage() {
    if (
      this.currentIndexImage > 0 &&
      this.currentIndexImage < this.productImages?.length!
    ) {
      this.showImage(this.currentIndexImage - 1);
    } else if (this.productImages) {
      this.showImage(this.productImages.length - 1);
    }
  }

  addToCart() {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (
      this.tokenService.getToken() == null ||
      (this.userService.getUserResponseFromLocalstorage() == null &&
        this.userService.getUserResponseFromSessionstorage() == null)
    ) {
      alert('Please login first');
      this.router.navigate(['/login']);
      return; // Dừng thực hiện tiếp nếu người dùng chưa đăng nhập
    }

    // Thực hiện thêm sản phẩm vào giỏ hàng
    if (this.product) {
      debugger;
      this.cartService.addToCart(this.productId, this.quantity);
    } else {
      console.error('Cannot find product with id = ' + this.productId);
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalAmount(): number {
    const price = this.product?.price ?? 0; // Nếu price không có, mặc định là 0
    return this.quantity * price; // Tính tổng số tiền
  }

  buyNow() {
    this.router.navigate(['orders']);
  }
}
