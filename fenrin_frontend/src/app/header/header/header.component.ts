import { Component } from '@angular/core';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn?: boolean;

  constructor(public authService: AuthService) {  }

  ngDoCheck() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  logout(){
    this.authService.logout();
  }

}
