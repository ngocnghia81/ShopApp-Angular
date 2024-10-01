import {Inject, Injectable, OnInit} from "@angular/core";
import { ProductService } from "./product.service";
import { UserReponse } from "../responses/UserReponse";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class CartService{
  private localStorage?: Storage;

  private readonly cart: Map<string, number> = new Map();

  constructor(private productService: ProductService, @Inject(DOCUMENT) document: Document) {
    this.localStorage = document.defaultView?.localStorage;
    const cart = this.localStorage?.getItem(this.getCartKeys());
    if (cart) {
      this.cart = new Map<string, number>(JSON.parse(cart));
    }
  }

  getCartKeys(): string {
    const userResponseJson: string = this.localStorage?.getItem("user")??"";
    const userResponse: UserReponse = JSON.parse(userResponseJson);

    return `cart-${userResponse.id}`;
  }

  getCart(): Map<string, number> {
    return this.cart;
  }

  addToCart(productId: number, quantity: number) {
    debugger;
    if (this.cart.has(productId.toString())) {
      this.cart.set(
        productId.toString(),
        this.cart.get(productId.toString())! + quantity,
      );
    } else {
      this.cart.set(productId.toString(), quantity);
    }
    this.saveToLocalStorage();
    alert("Added to cart");
  }

  removeFromCart(productId: number) {
    if (this.cart.has(productId.toString())) {
      this.cart.delete(productId.toString());
      this.saveToLocalStorage();
      alert("Removed from cart");
    }
  }

  clearCart() {
    this.cart.clear();
  }

  private saveToLocalStorage() {
    this.localStorage?.setItem(
      this.getCartKeys(),
      JSON.stringify(Array.from(this.cart.entries())),
    );
  }


}
