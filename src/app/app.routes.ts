import { Routes } from '@angular/router';
import { Projects } from './projects/projects';
import { ProjectDetails } from './project-details/project-details';

export const routes: Routes = [
  //   { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: '', component: Projects },
  {
    path: 'property-details/:project_stub',
    component: ProjectDetails
  },

  { path: '**', redirectTo: 'map' }
];

