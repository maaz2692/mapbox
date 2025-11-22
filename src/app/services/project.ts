import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectsModel } from '../models/Projects.model';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private jsonUrl = '/projects.json';
  private MlsUrl = '/mlszone.json';

  constructor(private http: HttpClient) { }
  private searchResult: any

  getProjects(): Observable<ProjectsModel[]> {
    return this.http.get<ProjectsModel[]>(this.jsonUrl);
  }

  getMlsZone(): Observable<{ id: number; name: string; }[]> {
    return this.http.get<{ id: number; name: string; }[]>(this.MlsUrl)
  }
    getSearchResult(){
    return this.searchResult
  }
}
