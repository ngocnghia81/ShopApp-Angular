import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpUtilService } from "./http-util-service.service";
import { environment } from "../environments/enviroment";
import { Observable } from "rxjs";
import { ProductResponseList } from "../responses/ProductResponseList";
import { Product } from "../models/Product";
import { ProductImage } from "../models/ProductImage";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiGetProducts: string = `${environment.apiBaseUrl}/products`;

  constructor(
    private httpClient: HttpClient,
    private httpUltilService: HttpUtilService,
  ) {}

  getProducts(
    keyword: string,
    categoryId: number,
    page: number,
    limit: number,
  ): Observable<ProductResponseList> | any {
    const url = `${this.apiGetProducts}?page=${page}&limit=${limit}&keyword=${keyword}&categoryId=${categoryId}`;
    console.log(url);
    return this.httpClient.get<ProductResponseList>(url, {
      headers: this.httpUltilService.createHeaders(),
    });
  }

  getDetailProduct(id: number): Observable<Product> | any {
    return this.httpClient.get<Product>(`${this.apiGetProducts}/${id}`, {
      headers: this.httpUltilService.createHeaders(),
    });
  }

  getProductImages(id: number): Observable<ProductImage[]> | any {
    return this.httpClient.get<ProductImage[]>(
      `${this.apiGetProducts}/images/${id}`,
      { headers: this.httpUltilService.createHeaders() },
    );
  }

  getProductsByIds(ids: number[]): Observable<Product[]> | any {
    const params: HttpParams = new HttpParams().set("ids", ids.join(","));
    return this.httpClient.get<Product[]>(`${this.apiGetProducts}/by-ids`, {
      params,
    });
  }

  deleteProduct(id: number): Observable<any> | any {
    return this.httpClient.delete(`${this.apiGetProducts}/${id}`, {
      headers: this.httpUltilService.createHeaders(),
      responseType: "text",
    });
  }
}
