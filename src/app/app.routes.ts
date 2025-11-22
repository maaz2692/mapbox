import { Routes } from '@angular/router';
import { Projects } from './projects/projects';

export const routes: Routes = [
    //   { path: '', redirectTo: 'map', pathMatch: 'full' },
      { path: '', component: Projects },
      { path: '**', redirectTo: 'map' }
    ];

