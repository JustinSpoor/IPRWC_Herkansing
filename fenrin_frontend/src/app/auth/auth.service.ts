import { Injectable, Injector } from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {HttpService} from "../shared/http.service";
import {ToastService} from "../shared/toast.service";
import { ShoppingCartService } from '../shop/shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly JWT_REFRESH_TOKEN = 'JWT_REFRESH_TOKEN';
  private loggedUser?: String;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private httpService: HttpService,
              private router: Router,
              private toasterService: ToastService,
              private injector: Injector) { }

  login(user: {
    username: string,
    password: string
  }): Observable<any>{
    return this.httpService.httpPost('authenticate', user).pipe(
      tap((response: any) => {
        this.doLoginUser(user.username, response.token, response.refreshToken)})
    )
  }

  register(user: {
    username: string,
    password: string,
  }) {

    return this.httpService.httpPost('register', user).subscribe({
      next: () => {
        this.toasterService.showSuccess(`Account voor ${user.username} is succesvol aangemaakt!`, 'Account aangemaakt');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toasterService.showError(`Er bestaat al een account met de naam ${user.username}`, 'Error');
      }
    });
  }

  private doLoginUser(username: string, token: any, refreshToken: any) {
    this.loggedUser = username;
    this.storeJwtToken(token);
    this.storeJwtRefreshToken(refreshToken);
    this.isAuthenticatedSubject.next(true);
    this.injector.get(ShoppingCartService).refreshCart();
    this.router.navigate(['/home'])
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.JWT_TOKEN)
  }

  isTokenExpired() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    if(!token) return true;

    const decoded = jwtDecode(token);

    if (!decoded.exp) return true;

    const experationDate = decoded.exp * 1000;
    const now = new Date().getTime();

    return experationDate < now;
  }

  isRefreshTokenExpired(token: any) {
    if(!token) return true;

    const decoded = jwtDecode(token);

    if (!decoded.exp) return true;

    const experationDate = decoded.exp * 1000;
    const now = new Date().getTime();

    return experationDate < now;
  }

  refreshToken() {
    let refreshToken: any = localStorage.getItem(this.JWT_REFRESH_TOKEN)
    if(!refreshToken) return;

    if(this.isRefreshTokenExpired(refreshToken)) {
      this.logout()
      return;
    }

    let refreshTokenMap = {
      "refreshToken": refreshToken
    }

    return this.httpService
      .httpPost('refreshtoken', refreshTokenMap)
      .pipe(tap((response: any) => this.storeJwtToken(response.token))).subscribe();
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeJwtRefreshToken(jwtRefresh: string) {
    localStorage.setItem(this.JWT_REFRESH_TOKEN, jwtRefresh);
  }

  getRoles(): string[] {
    const token = localStorage.getItem(this.JWT_TOKEN);
    if(!token) {
      return [];
    }

    const decodedToken: any = jwtDecode(token);
    return decodedToken?.roles?.map((role: any) => role.authority) || [];
  }

  hasRoles(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role)
  }

  getUsername() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    if(!token) {
      return;
    }
    const decodedToken: any = jwtDecode(token);
    return decodedToken?.sub;
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.JWT_REFRESH_TOKEN);
    this.isAuthenticatedSubject.next(false);
    this.injector.get(ShoppingCartService).refreshCart();
    this.router.navigate(['/home'])
    this.toasterService.showInfo('', 'Uitgelogd')
  }
}
