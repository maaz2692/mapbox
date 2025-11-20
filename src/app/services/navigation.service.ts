// src/app/navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  navigateToPropertyDetails(projectStub: string) {
    this.router.navigate(['/property-details', projectStub]);
  }
}
