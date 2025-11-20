import { Routes } from '@angular/router';
import { Projects } from "./projects/projects"
// import { HomeComponent } from './components/home/home.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', component: Projects },
  // { path: 'home', component: HomeComponent },
  // add more routes as needed
  { path: '**', redirectTo: 'map' }
];
