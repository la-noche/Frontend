import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { userInterface } from '../../interfaces/user.interface.js';
import { UserService } from '../../services/user.service.js';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  id!: number;
  name: string = '';
  lastName: string = '';
  userName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private messageService: MessageService, private userService: UserService, private router: Router){}

  addUser(){
    //validar que el usuario ingrese valores
    if(this.name == '' || this.lastName == '' || this.userName == '' || this.email == '' || this.password == '' || this.confirmPassword == ''){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios, por favor, complete los campos',
      });
      return;
    }

    //validar passwords iguales
    if(this.password != this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las passwords ingresadas son distintas',
      });
      return;
    }

    //creamos user
    const user: userInterface = {
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      userName: this.userName,
      email: this.email,
      password: this.password
    }

    //registramos user
    this.userService.signUp(user).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registrado',
          detail: `El usuario ${this.userName} fue registrado con exito`,
        });
        this.router.navigateByUrl('/login');
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
