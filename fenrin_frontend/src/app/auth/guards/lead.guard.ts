import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {Injectable} from "@angular/core";
import {ToastService} from "../../shared/toast.service";


@Injectable({
  providedIn: 'root'
})

export class LeadGuard implements  CanActivate{
  constructor(private authService: AuthService, private router: Router, private toasterService: ToastService) {  }

  canActivate(): boolean {
    if (!this.authService.hasRoles('ROLE_LEAD')) {
      this.router.navigate(['/home'])
      this.toasterService.showWarning('Je hebt niet de juiste permissies om naar deze pagina te gaan.', 'Waarschuwing')
      return false;
    }
    return true;
  }

}
