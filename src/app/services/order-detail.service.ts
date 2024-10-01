import { Injectable } from "@angular/core";
import { HttpUtilService } from "./http-util-service.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class OrderDetailService {
  constructor(
    private HttpClient: HttpClient,
    private httpUltilService: HttpUtilService,
  ) {}
}
