import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {Injectable} from "@angular/core";
import {ToastService} from "../../shared/toast.service";


@Injectable({
  providedIn: 'root'
})

export class AlreadyLoggedInGuard implements  CanActivate{
  constructor(private authService: AuthService, private router: Router, private toasterService: ToastService) {  }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home'])
      this.toasterService.showWarning('Je bent al ingelogd!', 'Waarschuwing')
      return false;
    }
    return true;
  }
}
