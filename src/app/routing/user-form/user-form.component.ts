import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service.js';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, ButtonModule, InputTextModule, FileUploadModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  formUser!: FormGroup;
  isSaveInProgress: boolean = false;
  imageFile: File | null = null;

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
          detail: 'User not found',
        });
        this.router.navigateByUrl('/');
      },
    });
  }

  onImageUpload(event: any) {
    this.imageFile = event.files[0]; 
  }

  updateUser() {
    if (this.formUser.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Check the fields and try again.',
      });
      return;
    }
    this.isSaveInProgress = true;
    const formData = new FormData();
    formData.append('id', this.formUser.get('id')?.value);
    formData.append('name', this.formUser.get('name')?.value);
    formData.append('lastName', this.formUser.get('lastName')?.value);
    formData.append('userName', this.formUser.get('userName')?.value);
    formData.append('email', this.formUser.get('email')?.value);
    if (this.imageFile) {
      formData.append('image', this.imageFile); 
    }
    this.userService.updateUser(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'User updated successfully',
        });
        this.router.navigateByUrl('/user');
      },
      error: (err) => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Check the fields and try again.',
        });
      },
    });
  }
}
