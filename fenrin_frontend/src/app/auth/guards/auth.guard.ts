import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {Injectable} from "@angular/core";
import {ToastService} from "../../shared/toast.service";


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements  CanActivate{
  constructor(private authService: AuthService, private router: Router, private toasterService: ToastService) {  }

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'])
      this.toasterService.showWarning('Je moet ingelogd zijn om naar deze pagina te kunnen', 'Waarschuwing')
      return false;
    }
    return true;
  }

}
