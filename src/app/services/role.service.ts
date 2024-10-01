import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilService} from "./http-util-service.service";
import {environment} from "../environments/enviroment";
import {Observable} from "rxjs";
import {Role} from "../models/role";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiGetRoles  = `${environment.apiBaseUrl}/roles`;

  constructor(private httpClient: HttpClient,private httpUltilService:HttpUtilService) { }


  getRoles():Observable<Role[]> | any {
    return this.httpClient.get(`${this.apiGetRoles}`, {headers: this.httpUltilService.createHeaders()});
  }
}
