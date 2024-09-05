import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, RouterOutlet, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  userName: string = '';
  password: string = '';
  
  constructor(private messageService: MessageService, private userService: UserService, private router: Router){}

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
        console.log(token);
        localStorage.setItem('token', token);
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
