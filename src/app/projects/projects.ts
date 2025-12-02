import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import {Filters} from "../filters/filters"
import * as mapboxgl from 'mapbox-gl';
import { Developer } from '../models/developers.model';
import { ProjectsModel } from "../models/Projects.model"
import { ProjectService } from "../services/project"
import { debounceTime, fromEvent } from 'rxjs';
import { NavigationService } from '../services/navigation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectCards } from "../project-cards/project-cards";
import { ShimmerComponent } from "../shimmer/shimmer";
import { MatIconModule } from '@angular/material/icon';
import { Loader } from "../loader/loader";

interface SelectOption {
  id: number;
  name: string;
}

interface SearchParams {
  mls_zone: SelectOption[];
  search: string;
  area: string;
  city: SelectOption[];
  status: string;
  price: string;
  type: SelectOption[];
  developer: SelectOption[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, Filters, FormsModule, ProjectCards, ShimmerComponent, MatIconModule, Loader],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})

export class Projects implements OnInit  {
  @ViewChildren(Filters)
  dropdowns!: QueryList<Filters>;
  isShimmerVisible: boolean = true;
  cards: any[] = Array(9).fill({});
  isLoading = false;
  mapBounds: boolean = true;

  params: SearchParams = {
    mls_zone: [],
    search: '',
    area: '',
    developer: [],
    city: [],
    status: 'All',
    price: 'All',
    type: [],
  };
  searchResult: any;
  noProjects = false;
  cities: Array<{ id: number; name: string }> = [];
  buildersAndDevelopers: Array<{ id: number; name: string }> = [];
  private cityIdCounter: number = 0;
  private developerCounter: number = 0;

  types: Array<{ id: number; name: string }> = [
    { id: 0, name: 'Condos' },
    { id: 1, name: 'Detached' },
    { id: 2, name: 'Semi Detached' },
    { id: 3, name: 'Townhouse' },
    { id: 4, name: 'Quadraplex' },
    { id: 5, name: 'Link' },
    { id: 6, name: 'Stacked' },
  ];

  typeMappings: { [key: string]: string[] } = {
    Condos: ['Apartment', 'Low Rise', 'High Rise', 'Mid Rise', 'Loft'],
    Detached: ['Detached', 'Single Family'],
    'Semi Detached': ['Semi Detached'],
    Townhouse: ['Townhouse', 'Row'],
    Quadraplex: ['Quadraplex'],
    Link: ['Link'],
    Stacked: ['Stacked']
  };

  mlsZones: Array<{ id: number; name: string }> = [];

  selectedMlsZones: Array<{ id: number; name: string }> = [];
  selectedCities: Array<{ id: number; name: string }> = [];
  selectedTypes: Array<{ id: number; name: string }> = [];

  geo: any = [];
  allProjects: ProjectsModel[] = [];
  filteredProjects: ProjectsModel[] = [];
  favProjects: ProjectsModel[] = [];
  favouriteAllProjects: ProjectsModel[] = [];
  cloneFilterProjects: ProjectsModel[] = [];
  toggleDrawer = false;
  closeMAP = false;
  showMap = false;
  showCards = true;
  showFilters = false;
  showFooterButtons = true;
  ne: any;
  sw: any;
  bounds: any;
  hoverStateId: any = null;
  searchZoom: any;
  isZoom: boolean = false;
  citySelection: string = '';
  typeSelection: string = '';
  developer: Developer[] = [];
  isChecked: boolean = false;
  projectAvaliable: boolean = false;
  canadaBoundary: any;

  constructor(
    private ProjectService: ProjectService,
    private navigationService: NavigationService,
  ) {
  }

  async ngOnInit() {
    this.isLoading = false;
    await this.getAllProjects();
    await this.getBuilders();

    this.getMLSZones();

    this.searchResult = this.ProjectService.getSearchResult();
    if (this.searchResult == null) {
    } else {
      this.params.search = this.searchResult.text;
      this.search();
    }
  }
  Drawer() {
    this.toggleDrawer = !this.toggleDrawer;
  }

  closeMap() {
    this.closeMAP = !this.closeMAP;
  }

  showMapResponsive() {
    this.showCards = !this.showCards;
    this.showMap = !this.showMap;
  }

  showFilterDrawer() {
    this.showFilters = !this.showFilters;
    this.showFooterButtons = !this.showFooterButtons;
  }

  resetFilters() {
    this.dropdowns.forEach((dropdown) => dropdown.clearSelections());

    this.isZoom = false;
    const { search, mls_zone, status, price, city } = this.params;
    if (search !== '' || status !== 'All' || price !== 'All') {
      if (this.showFilters) {
        this.showFilters = !this.showFilters;
        this.showFooterButtons = !this.showFooterButtons;
      }
      this.params = {
        mls_zone: [],
        search: '',
        area: '',
        developer: [],
        city: [],
        status: 'All',
        price: 'All',
        type: [],
      };
      this.search();
    }
    this.setMap();
  }

  navigateToDetailsPopup(stub: string) {
    this.navigationService.navigateToPropertyDetails(stub);
  }

  shimmerCompleteHandler() {}

      async getBuilders(): Promise<void> {
    let counter = 0;
    try {
      this.ProjectService.getBuilders().subscribe(data => {
        this.developer = data;
        if (this.developer && this.developer.length) {
        this.developer.forEach((developer) => {
          this.buildersAndDevelopers.push({
            id: counter++,
            name: developer?.developer?.name ?? "",
          });
        });
      } else {
      }
      })

    } catch (error) {}
  }

  async getAllProjects() {
    return new Promise<void>((resolve, reject) => {
      this.ProjectService.getProjects().subscribe(data => {
        this.allProjects = data;
        console.log("projects", this.allProjects)
        if(this.allProjects.length <= 0){
          this.noProjects = true
          this.projectAvaliable = true
        }
        this.filteredProjects = this.allProjects;
        this.isShimmerVisible = false;
        this.cities = [];
        this.allProjects.forEach((project) => {
          if (project.project_information?.city) {
            const cityName = project.project_information.city;
            // Check if the city already exists in the cities array
            const existingCity = this.cities.find(
              (city) => city.name === cityName
            );
            if (!existingCity) {
              this.cities.push({ id: this.cityIdCounter++, name: cityName });
            }
          }
        });
        this.cities.sort((a, b) => a.name.localeCompare(b.name));
        resolve();
      });
    }).then(() => {
      // Call setMap() after resolving the promise
      this.setMap();
    });
  }
  async getProjectByBounds(bounds: any) {
    this.isShimmerVisible = true;
    this.isLoading = true;
    this.noProjects = false;

    const southwest = bounds._sw;
    const northeast = bounds._ne;

    // Function to filter projects by bounds
    const filterProjectsByBounds = (projects: any) => {
      return projects.filter((project: any) => {
        const [longitude,latitude] = project.project_information.geoJSON.coordinates
         || [null, null];
        if (latitude === null || longitude === null) return false;

        return (
          latitude >= southwest.lat &&
          latitude <= northeast.lat &&
          longitude >= southwest.lng &&
          longitude <= northeast.lng
        );
      });
    };

    if (this.isChecked) {
      this.cloneFilterProjects = filterProjectsByBounds(this.favProjects);
    } else {
      this.cloneFilterProjects = filterProjectsByBounds(this.filteredProjects);
    }

    this.noProjects = this.cloneFilterProjects.length === 0;
    this.isLoading = false;
    this.isShimmerVisible = false;
  }



  clearMapBounds() {
    this.mapBounds = false;
    this.setMap();
  }
  addMapBounds() {
    this.mapBounds = true;
    this.setMap();
  }

  async setMap() {
    this.geo = [];

    const addProjectToGeo = (project: any) => {
      const coordinates = project.project_information?.geoJSON.coordinates
      const finalCoordinates = coordinates
        ? [coordinates[0], coordinates[1]]
        : [-79.383935, 43.653482];

      this.geo.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: finalCoordinates,
        },
        properties: {
          description: project.description?.project_description || '',
          project_url: '',
          project_name: project.information?.title || '',
          project_stub: project.project_stub || '',
          project_image: project.project_image || '',
          city: project.project_information?.city || '',
          province: project.project_information?.province || '',
          developer: project.developer || '',
        },
      });
    };

    const projects = this.isChecked ? this.favProjects : this.filteredProjects;
    projects.forEach(addProjectToGeo);
    const mapContainer = document.getElementById('map');
if (mapContainer) {
    mapContainer.innerHTML = '';  // Ensure it's empty
}
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      accessToken: 'YOUR_MAPBOX_KEY_HERE',
      center: this.searchZoom
        ? this.searchZoom
        : this.searchResult
        ? this.searchResult.center
        : [-79.383935, 43.653482],
      zoom: this.searchZoom ? 10 : this.searchResult ? 10 : 7,
      minZoom: 5,
      maxZoom: 15,
      attributionControl: false,
    });

    const nav = new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true,
    });
    map.addControl(nav, 'top-right');

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: true,
    });
    map.addControl(geolocate, 'top-right');

    await new Promise((resolve) => {
      map.on('load', () => {
        this.isLoading = false;

        map.addSource('real-estate-projects', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.geo,
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 20,
        });

        map.addLayer({
          id: 'single-circle',
          type: 'circle',
          source: 'real-estate-projects',
          paint: {
            'circle-radius': 20,
            'circle-color': '#9B8247',
          },
        });

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'real-estate-projects',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#9B8247',
              100,
              '#9B8247',
              750,
              '#9B8247',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });

        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters'],
          });
          const clusterId = features[0].properties?.['cluster_id'];
          const source = map.getSource(
            'real-estate-projects'
          ) as mapboxgl.GeoJSONSource;

          if (source.getClusterExpansionZoom) {
            source.getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;
              const geometry = features[0].geometry as GeoJSON.Point;
              map.easeTo({
                center: geometry.coordinates as [number, number],
                zoom: (zoom ?? 2) + 1,
              });
            });
          }
        });

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'real-estate-projects',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
          },
          paint: {
            'text-color': 'white',
          },
        });

        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'real-estate-projects',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#191c40',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#191c40',
          },
        });

        map.addSource('number-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.geo,
          },
        });

        map.addLayer({
          id: 'number-layer',
          type: 'symbol',
          source: 'number-source',
          layout: {
            'text-field': ['get', 'number'],
            'text-size': {
              base: 1,
              stops: [
                [0, 12],
                [10, 16],
              ],
            },
            'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0],
          },
          paint: {
            'text-color': 'white',
          },
        });

        map.on('click', 'unclustered-point', (e) => {
          const features = e.features;
          if (!features || features.length === 0) return;

          const feature = features[0];
          const properties = feature.properties;
          const geometry = feature.geometry as GeoJSON.Point;
          const stub = properties?.['project_stub'];
          let projectImage = properties?.['project_image'];
          let imageUrl =
            projectImage !== ''
              ? projectImage
              : '../../assets/images/pages/No_Image.png';
          let imgAlt = projectImage !== '' ? '' : 'No Image';
          const popupContent = `
                                <div style="display: flex; flex-direction: column; justify-content: center; background-color: #fff">
                                  <img id="navigate-image" src="${imageUrl}" alt="${imgAlt}" style="max-width: 100%; cursor: pointer; max-height: 150px; object-fit: cover;">
                                  <br>
                                  <div style="display: flex; flex-direction: column; padding: 0 10px 10px 10px">
                                    <div id="navigate-button-title" style="cursor:pointer !important">
                                      <span style="font-family: Montserrat; font-size: 14px; font-weight: 700; line-height: 16px; text-align: left;">${properties?.['project_name']}</span><br>
                                    </div>
                                    <div>
                                      <span style="font-family: Montserrat; font-size: 12px; font-weight: 600; line-height: 14.63px; text-align: left; color: #9b8247;">${properties?.['province']}, ${properties?.['city']}</span>
                                    </div>
                                    <div id="navigate-button" style="background-color: #9b8247; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; margin-top: 10px; text-align: center;">
                                      View Details
                                    </div>
                                  </div>
                                </div>
                                `;

          const popup = new mapboxgl.Popup()
            .setLngLat(geometry.coordinates as [number, number])
            .setHTML(popupContent)
            .addTo(map);
          const navigateImage = document.getElementById('navigate-image');
          if (navigateImage) {
            navigateImage.addEventListener('click', () => {
              this.navigateToDetailsPopup(stub);
            });
          }
          const navigateButton = document.getElementById('navigate-button');
          if (navigateButton) {
            navigateButton.addEventListener('click', () => {
              this.navigateToDetailsPopup(stub);
            });
          }

          const navigateButtonTitle = document.getElementById(
            'navigate-button-title'
          );
          if (navigateButtonTitle) {
            navigateButtonTitle.addEventListener('click', () => {
              this.navigateToDetailsPopup(stub);
            });
          }
        });

        fromEvent(map, 'zoom')
          .pipe(debounceTime(1500))
          .subscribe(() => {
            this.isZoom = true;
            this.bounds = map.getBounds();
            this.getProjectByBounds(this.bounds);
          });

        fromEvent(map, 'move')
          .pipe(debounceTime(1500))
          .subscribe(() => {
            this.isZoom = true;
            this.bounds = map.getBounds();
            this.getProjectByBounds(this.bounds);
          });

        map.on('idle', () => {
          map.resize();
        });

        resolve('resolved');
      });
    });
  }

  viewResults() {
    this.showFilters = !this.showFilters;
    this.showFooterButtons = !this.showFooterButtons;
    this.search();
  }

  handleSelectionChangeMLSZone(
    selectedOptions: Array<{ id: number; name: string }>
  ): void {
    this.params.mls_zone = [...selectedOptions];
    this.search();
  }
  handleSelectionChangeCity(
    selectedOptions: Array<{ id: number; name: string }>
  ): void {
    this.params.city = [...selectedOptions];
    this.search();
  }
  handleSelectionChangeType(
    selectedOptions: Array<{ id: number; name: string }>
  ): void {
    this.params.type = [...selectedOptions];
    if (this.typeSelection) {
      setTimeout(() => {
        this.search();
      }, 2000);
    } else {
      this.search();
    }
  }
  handleSelectionChangeDeveloper(
    selectedOptions: Array<{ id: number; name: string }>
  ): void {
    this.params.developer = [...selectedOptions];
    this.search();
  }
  async search() {
    this.noProjects = false;
    this.isLoading = true;
    this.searchResult = '';

    // Function to filter projects based on multiple criteria
    const filterProjects = (projects: any) => {
      return projects.filter((project: any) => {
        return (
          this.filterByMLSZone(project) &&
          this.filterByType(project) &&
          this.filterByCity(project) &&
          this.filterByDeveloper(project) &&
          this.filterByKeyword(project) 
        );
      });
    };

    if (this.isChecked) {
      this.favProjects = filterProjects(this.favouriteAllProjects);
      if (this.favProjects.length === 0) {
        this.noProjects = true;
        this.projectAvaliable = false
      }
    } else {
      this.filteredProjects = filterProjects(this.allProjects);
      if (this.filteredProjects.length === 0) {

        this.noProjects = true;
        if(this.allProjects.length <= 0){
          this.projectAvaliable = true

        }

      }
    }

    this.isZoom = false;
    await this.setMap();
    this.isLoading = false;
  }

  filterByDeveloper(project: any): boolean {
    if (this.params.developer.length === 0) {
      return true;
    }
    return this.params.developer.some(
      (developer) => developer.name === project.developer?.name
    );
  }

  filterByMLSZone(project: any): boolean {
    // If 'All' is selected or no specific zones are selected, include all projects
    if (this.params.mls_zone.length === 0) {
      return true;
    }

    // Check if the project's MLS zone is included in the selected zones
    return this.params.mls_zone.some(
      (zone) => zone.name === project.project_information.mls_zone
    );
  }

  filterByCity(project: any): boolean {
    if (this.params.city.length === 0) {
      return true;
    }
    return this.params.city.some(
      (city) => city.name === project.project_information.city
    );
  }

  filterByType(project: any): boolean {
  if (this.params.type.length === 0) {
    return true;
  }

  return this.params.type.some((selectedType) => {
    const mappedTypes = this.typeMappings[selectedType.name] || [selectedType.name];
    return project.type.some((projType: string) =>
      mappedTypes.some(
        (mappedType) => projType.toLowerCase() === mappedType.toLowerCase()
      )
    );
  });
}


  filterByKeyword(project: any): boolean {
    if (this.params.search === '' || this.params.search === undefined) {
      return true;
    }

    const keyword = this.params.search.toLowerCase();
    return this.projectContainsKeyword(project, keyword);
  }

  projectContainsKeyword(project: any, keyword: string): boolean {
    for (const key in project) {
      if (project.hasOwnProperty(key)) {
        const value = project[key];
        if (
          typeof value === 'string' &&
          value.toLowerCase().includes(keyword)
        ) {
          return true;
        } else if (typeof value === 'object') {
          if (this.projectContainsKeyword(value, keyword)) {
            return true;
          }
        }
      }
    }
    return false;
  }

getMLSZones() {
  this.ProjectService.getMlsZone().subscribe(data => {
    this.mlsZones = data;
  });
}
}