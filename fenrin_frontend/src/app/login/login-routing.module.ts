import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {LoginPageComponent} from "./login-page/login-page.component";
import {AlreadyLoggedInGuard} from "../auth/guards/alreadyLoggedIn.guard";
import { RegisterPageComponent } from "./register-page/register-page.component";

export const loginRoutes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [AlreadyLoggedInGuard]
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [AlreadyLoggedInGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule]
})

export class LoginRoutingModule {}
