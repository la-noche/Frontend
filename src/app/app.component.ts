import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons, MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastModule, ButtonModule, MenubarModule, CommonModule, PanelModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  items: MenuItem[] | any;
  isAuthenticated: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación del servicio
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });

    // Configurar los elementos del menú
    this.items = [
      { label: 'Home', icon: 'pi pi-home', routerLink: 'Inicio' },
      { label: 'Game Types', icon: 'pi pi-objects-column', routerLink: 'gameTypes' },
      { label: 'Games', icon: 'pi pi-sparkles', routerLink: 'game' },
      { label: 'Regions', icon: 'pi pi-globe', routerLink: 'region' },
      { label: 'Competitions', icon: 'pi pi-trophy', routerLink: 'competition' },
      { label: 'Teams', icon: 'pi pi-users', routerLink: 'team' },
      { label: 'News', icon: 'pi pi-th-large', routerLink: 'news' },
    ];

    // Si el usuario no está autenticado, redirigirlo al login
    if (!this.isAuthenticated) {
      this.router.navigateByUrl('/login');
    }
  }

  logOut() {
    this.authService.logout();  // Usar el servicio para hacer logout
    this.router.navigateByUrl('/login');
  }
}