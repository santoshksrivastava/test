import { Component, Renderer2  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isSidebarVisible = true;
  menuItems: any[] = [];
  userName: string | null = '';
  constructor(private router: Router,private renderer: Renderer2) {
    this.loadMenu();
    this.userName = localStorage.getItem('userName');
  }

  toggleSidebar() {
    const body = document.getElementById('main-body');
    if (body) {
      // Toggle class 'adjst-spc' based on its presence
      if (body.classList.contains('adjst-spc')) {
        this.renderer.removeClass(body, 'adjst-spc');
      } else {
        this.renderer.addClass(body, 'adjst-spc');
      }
    }
  }
  

  logout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('userData');
    localStorage.removeItem('userName');
    this.router.navigate(['']);
  }

  loadMenu(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.menuItems = parsedData.menu || [];
    }
  }
}
