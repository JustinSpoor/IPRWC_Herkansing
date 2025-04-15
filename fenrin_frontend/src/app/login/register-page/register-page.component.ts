import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  username: string = '';
  password: string = '';
  passwordRepeat: string = '';
  showPassword: boolean = false;
  showPasswordRepeat: boolean = false;


  constructor(private authService: AuthService,private toasterService: ToastService) {
  }
  
  onSubmit() {
    if(this.password !== this.passwordRepeat) {
      this.toasterService.showWarning('Wachtwoorden komen niet overeen', 'Waarschuwing')
      return;
    }

    this.authService.register({
      username: this.username,
      password: this.password
    });
  }
}
