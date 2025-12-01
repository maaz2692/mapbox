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

  }
}
