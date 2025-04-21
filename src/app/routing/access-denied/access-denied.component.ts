import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterModule],
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {
  reason: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.reason = this.route.snapshot.queryParamMap.get('reason');
    let detail = 'You do not have access to this section';

    if (this.reason === 'not-admin') {
      detail = 'Admin role is required to access this section';
    }

    if (this.reason === 'not-creator') {
      detail = 'You are not the creator of this section';
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Access denied',
      detail,
    });
  }
}

