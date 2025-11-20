import { Component, OnInit, Input } from '@angular/core';
import { ProjectsModel } from '../models/Projects.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-cards',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './project-cards.html',
  styleUrl: './project-cards.scss'
})
export class ProjectCards implements OnInit {
  image: string | undefined;
  userMo: any;
  favProjarr = [];
  isStubPresent: Boolean = false;
  fav: Boolean = false;
  localStorageKey = 'favoriteProjects';

  constructor(

  ) {}

  @Input() project!: ProjectsModel;
  ngOnInit() {
    const storedProjects = localStorage.getItem(this.localStorageKey);
    if (storedProjects) {
      if (storedProjects.includes(this.project.project_stub ?? "")) {
        this.fav = true;
      }
    }
  }

  FavClicked(event: Event): void {
    event.stopPropagation();
    const storedProjectsString = localStorage.getItem(this.localStorageKey);

    // Parse the storedProjects string into an array, or use an empty array if it is null
    const storedProjects = storedProjectsString
      ? JSON.parse(storedProjectsString)
      : [];

    const index = storedProjects.indexOf(this.project.project_stub);
    if (index === -1) {
      this.fav = true;
      storedProjects.push(this.project.project_stub);
    } else {
      this.fav = false;
      storedProjects.splice(index, 1);
    }

    // Store the updated array back to localStorage
    localStorage.setItem(this.localStorageKey, JSON.stringify(storedProjects));
  }

  private getUserInfoFromLocalStorage() {
    return localStorage.getItem('user-mo');
  }
}
