import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../services/user.service.js';
import { userInterface } from '../../interfaces/user.interface.js';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ButtonModule, CardModule, RouterModule, RouterOutlet, DatePipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  user?: userInterface;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id || null;
    }
    return null;
  }

  getUser() {
    const userId = this.getUserIdFromToken();
    if (userId !== null) {
      this.userService.getUserById(userId).subscribe({
        next: (userData) => {
          this.user = userData;
          console.log('User data', this.user);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo encontrar el usuario',
          });
        },
      });
    }
  }
}
