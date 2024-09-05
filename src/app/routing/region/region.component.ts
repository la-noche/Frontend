import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RegionInterface } from '../../interfaces/region.interface.js';
import { RegionService } from '../../services/region.service.js';
import { MessageService } from 'primeng/api';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-region',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CardModule, ButtonModule],
  templateUrl: './region.component.html',
  styleUrl: './region.component.css'
})

export class RegionComponent implements OnInit {
  regionList: RegionInterface[] = [];
  isDeleteInProgress: boolean = false;

  constructor(
    private regionService: RegionService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getRegions();
  }

  getRegions() {
    this.regionService.getRegions().subscribe((data) => {
      this.regionList = data;
    });
  }

  deleteRegion(id: number) {
    this.isDeleteInProgress = true;
    this.regionService.deleteRegion(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Region eliminada',
        });
        this.isDeleteInProgress = false;
        this.getRegions();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la Region',
        });
      },
    });
  }
}