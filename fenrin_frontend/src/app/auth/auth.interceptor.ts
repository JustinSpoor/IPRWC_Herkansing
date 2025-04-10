import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private refreshTokenEndpoint = '/refreshtoken'

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const jwtToken = this.getJwtToken();

    if (this.authService.isTokenExpired()) {
      this.authService.refreshToken();
    }
    
    if(request.url.includes(this.refreshTokenEndpoint)) {
      const modifiedRequest = request.clone({
        headers: request.headers.delete('Authorization'),
      });
      return next.handle(modifiedRequest)
    }

    if(jwtToken) {
      var cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return next.handle(cloned);
    }
    return next.handle(request);
  };

    getJwtToken(): string | null {
      return localStorage.getItem('JWT_TOKEN');
  }
}
