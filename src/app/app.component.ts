import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MenuItem, MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { AuthService } from './services/auth.service';
import { SidebarModule } from 'primeng/sidebar';
import { DividerModule } from 'primeng/divider';
import { jwtDecode } from 'jwt-decode';
import { UserService } from './services/user.service.js';
import { userInterface } from './interfaces/user.interface.js';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ToastModule, ButtonModule, MenubarModule, CommonModule, PanelModule, SidebarModule, DividerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  items: MenuItem[] | any;
  isAuthenticated: boolean = false;
  sidebarVisible: boolean = false;
  user?: userInterface;
  
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService, private messageService: MessageService) {}

  ngOnInit() {
    
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;

        this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
          this.isAuthenticated = isAuthenticated;

          if (!isAuthenticated) {
            // Solo rutas públicas
            if (
              !currentUrl.startsWith('/reset-password') &&
              !currentUrl.startsWith('/forgot-password') &&
              !currentUrl.startsWith('/signup') &&
              !currentUrl.startsWith('/login')
            ) {
              this.router.navigateByUrl('/login');
            }
          } else {
            this.getUser();
          }
        });
      });
  }
  
  getUser() {
    const userId = this.getUserIdFromToken();
    if (userId !== null) {
      this.userService.getUserById(userId).subscribe({
        next: (userData) => {
          this.user = userData;
          this.setupMenu();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User not found',
          });
        },
      });
    }
  }

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id || null;
    }
    return null;
  }

  setupMenu() {
    const isAdmin = this.user?.role === 'admin';
    this.items = [
      { label: 'Home', icon: 'pi pi-home', routerLink: 'home' },
      { label: 'Games', icon: 'pi pi-sparkles', routerLink: 'game' },
      { label: 'Competitions', icon: 'pi pi-trophy', routerLink: 'competition' },
      { label: 'Teams', icon: 'pi pi-users', routerLink: 'team' },
      { label: 'News', icon: 'pi pi-th-large', routerLink: 'news' },
      ...(isAdmin ? [
        { label: 'Game Types', icon: 'pi pi-objects-column', routerLink: 'gameTypes' },
        { label: 'Regions', icon: 'pi pi-globe', routerLink: 'region' }
      ] : []),
    ]
  }

  logOut() {
    this.authService.logout(); 
    this.router.navigateByUrl('/login');
  }
}