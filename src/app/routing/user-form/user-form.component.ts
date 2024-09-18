import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service.js';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, ButtonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  formUser!: FormGroup;
  isSaveInProgress: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {
    this.formUser = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      userName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getUserById(+id!);
  }

  getUserById(id: number) {
    this.userService.getUserById(id).subscribe({
      next: (foundUser) => {
        this.formUser.patchValue(foundUser);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario no encontrado',
        });
        this.router.navigateByUrl('/');
      },
    });
  }

  updateUser() {
    if (this.formUser.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.userService.updateUser(this.formUser.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Usuario actualizado correctamente',
        });
        this.router.navigateByUrl('/user');
      },
      error: (err) => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Revise los campos e intente nuevamente',
        });
      },
    });
  }
}
