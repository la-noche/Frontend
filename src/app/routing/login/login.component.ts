import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service.js';
import { AuthService } from '../../services/auth.service.js';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, RouterOutlet, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  userName: string = '';
  password: string = '';
  
  constructor(private messageService: MessageService, private userService: UserService, private router: Router, private authService: AuthService){}

  login() {
    //validar que el usuario ingrese valores
    if (this.userName == '' || this.password == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Todos los campos son obligatorios, por favor, complete los campos',
      });
      return;
    };

    //creamos user
    const user: any = {
      userName: this.userName,
      password: this.password
    };

    this.userService.login(user).subscribe({
      next: (token) => {
        this.router.navigateByUrl('/inicio');
        this.authService.login(token); 
        this.messageService.add({
          severity: 'success',
          summary: 'Bienvenido',
          detail: `Te damos la bienvenida ${this.userName}, gracias por visitarnos`,
        });
      },
      error: (errorResponse) => {
        //muestro el mesaje de error cual fuere del back
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorResponse.error.message,
        });
      },
    });
  }
}
