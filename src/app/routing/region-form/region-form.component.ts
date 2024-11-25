import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegionService } from '../../services/region.service.js';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { RegionInterface } from '../../interfaces/region.interface.js';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-region-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    CardModule,
    RouterOutlet,
    DropdownModule,
  ],
  templateUrl: './region-form.component.html',
  styleUrl: './region-form.component.css'
})

export class RegionFormComponent implements OnInit {
  formRegion!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;
  regionList: RegionInterface[] = [];
  regionLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private regionService: RegionService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formRegion = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
      this.getRegionById(+id!);
    }
  }

  getRegionById(id: number) {
    this.regionService.getRegionById(id).subscribe({
      next: (foundRegion) => {
        this.formRegion.patchValue(foundRegion);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Not found',
        });
        this.router.navigateByUrl('/');
      },
    });
  }

  createRegion() {
    if (this.formRegion.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please, complete the required fields',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.regionService.createRegion(this.formRegion.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Creada',
          detail: 'Region successfully saved',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/region');
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please check the fields and try again',
        });
      },
    });
    console.log(this.formRegion.value);
  }

  updateRegion() {
    if (this.formRegion.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please check the fields and try again',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.regionService.updateRegion(this.formRegion.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Region successfully updated',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/region');
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please check the fields and try again',
        });
      },
    });
  }
}
