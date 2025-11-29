import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ProjectsModel } from '../models/Projects.model';
import { Developer } from '../models/developers.model';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private jsonUrl = '/projects.json';
  private MlsUrl = '/mlszone.json';
  private developerUrl = '/developers.json'

  constructor(private http: HttpClient) { }
  private searchResult: any

  getProjects(): Observable<ProjectsModel[]> {
    return this.http.get<ProjectsModel[]>(this.jsonUrl);
  }

  getProjectByStub(stub: string): Observable<ProjectsModel | undefined> {
  return this.http.get<ProjectsModel[]>(this.jsonUrl).pipe(
    map((projects) => projects.find(p => p.project_stub === stub))
  );
}

  getBuilders(): Observable<Developer[]>{
    return this.http.get<Developer[]>(this.developerUrl)
  }

  getMlsZone(): Observable<{ id: number; name: string; }[]> {
    return this.http.get<{ id: number; name: string; }[]>(this.MlsUrl)
  }
    getSearchResult(){
    return this.searchResult
  }
}
