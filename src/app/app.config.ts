import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient} from "@angular/common/http";
import {withFetch} from "@angular/common/http";
import {Provider} from "@angular/core";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "./inteceptors/token.interceptor";
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

const tokenInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    tokenInterceptorProvider,
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch())
  ]
};
