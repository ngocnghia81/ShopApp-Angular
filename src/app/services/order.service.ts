import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpUtilService } from "./http-util-service.service";
import { environment } from "../environments/enviroment";
import { OrderDto } from "../dtos/order/order.dto";
import { Observable } from "rxjs";
import { OrderResponse } from "../responses/OrderResponse";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiCreateOrder: string = `${environment.apiBaseUrl}/orders`;
  private apiGetOrders: string = `${environment.apiBaseUrl}/orders/get-orders-by-keyword`;

  constructor(
    private httpClient: HttpClient,
    private httpUltilService: HttpUtilService,
  ) {}

  public createOrder(order: OrderDto): Observable<OrderDto> {
    return this.httpClient.post<OrderDto>(this.apiCreateOrder, order, {
      headers: this.httpUltilService.createHeaders(),
    });
  }

  public getOrderById(id: number): Observable<OrderDto> | any {
    return this.httpClient.get<OrderDto>(`${this.apiCreateOrder}/${id}`, {
      headers: this.httpUltilService.createHeaders(),
    });
  }

  public getOrders(
    kw: string,
    page: number,
    limit: number,
  ): Observable<any> | any {
    const params: HttpParams = new HttpParams()
      .set("keyword", kw)
      .set("page", page)
      .set("limit", limit);
    return this.httpClient.get<any>(this.apiGetOrders, {
      params: params,
      headers: this.httpUltilService.createHeaders(),
    });
  }

  updateOrder(
    id: number,
    order: OrderResponse,
  ): Observable<OrderResponse> | any {
    return this.httpClient.put<OrderResponse>(
      `${this.apiCreateOrder}/${id}`,
      order,
      {
        headers: this.httpUltilService.createHeaders(),
      },
    );
  }

  getOrdersByProductId(id: number): Observable<any> | any {
    return this.httpClient.get<any>(`${this.apiCreateOrder}/product/${id}`, {
      headers: this.httpUltilService.createHeaders(),
    });
  }

  deleteOrder(id: number): Observable<any> | any {
    return this.httpClient.delete(`${this.apiCreateOrder}/${id}`, {
      responseType: "text",
    });
  }
}
