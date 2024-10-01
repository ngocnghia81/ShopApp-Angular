import { Injectable } from '@angular/core';
import {environment} from "../environments/enviroment";
import {HttpClient} from "@angular/common/http";
import {HttpUtilService} from "./http-util-service.service";
import {Observable} from "rxjs";
import {Category} from "../models/Category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiGetCategories  = `${environment.apiBaseUrl}/categories`

  constructor(private httpClient: HttpClient,private httpUltilService:HttpUtilService) { }

  getAllCategorys(): Observable<Category[]> | any {
    return this.httpClient.get(`${this.apiGetCategories}`, {headers: this.httpUltilService.createHeaders()});
  }
}
