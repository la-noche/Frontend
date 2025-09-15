import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service.js';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {}

  sendResetLink() {
    if (this.email.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter your email address.',
      });
      return;
    }

    this.userService.forgotPassword(this.email).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Email Sent',
          detail: 'A password reset link has been sent to your email address.',
        });
        this.router.navigateByUrl('/login');
      },
      error: (errorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorResponse.error.message,
        });
      },
    });
  }
}
