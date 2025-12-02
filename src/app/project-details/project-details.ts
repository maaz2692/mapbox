import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { ProjectService } from "../services/project"
import { ProjectsModel } from '../models/Projects.model';
import { NavigationService } from '../services/navigation.service';
import { ShimmerComponent } from '../shimmer/shimmer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-details',
  imports: [ShimmerComponent, CommonModule, RouterModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss'
})
export class ProjectDetails  implements OnInit {
  project: ProjectsModel[] = [];
  id: string = "";
  project_stub: string = "";
  selectedProject: any;
  schema = {};
  allProjects: ProjectsModel[] = [];
  isLoading = false;
  coordinates: any;
  noimage = '../../assets/images/pages/No_Image.png';
  cities = [];
  slides = [];
  isShimmerVisible: boolean = true;
  geo: any = [];

  constructor(
    private navigationService: NavigationService,
    private ProjectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.project_stub = params['project_stub'];
      this.ProjectService.getProjectByStub(this.project_stub).subscribe(data => {
        this.selectedProject = data;
        if (this.selectedProject.error) {
          this.router.navigate(['/**']);
        }

        this.slides = this.selectedProject.details.projectImageURLs;
        this.setMap();
      });
    });
  }
  onImageLoad() {
    console.log("imgae loaded")
    this.isShimmerVisible = false; 
    console.log("isShimmerVisible",this.isShimmerVisible) // Hide shimmer after image is loaded
  }
  onImageError() {
    console.log("in error")
    this.isShimmerVisible = false;  // Hide shimmer even if there's an error
  }
  setMap() {
    this.geo = [];
    var promise = new Promise((resolve, reject) => {
      this.coordinates = this.selectedProject.project_information.geoJSON.coordinates
      this.geo.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: this.coordinates,
        },
        properties: {
          project_url:
            this.selectedProject.project_information.project_url || '',
          project_stub: this.selectedProject.project_stub || '',
          project_image: this.selectedProject.project_image || '',
          project_name: this.selectedProject.information?.title || '',
          province:
            this.selectedProject.project_information.province ||
            this.selectedProject.project_information.country,
          city: this.selectedProject.project_information.city || '',
        },
      });
      resolve('resolved');
      this.isLoading = false;
    });

    promise.then((success) => {
      this.isLoading = false;
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        accessToken: 'YOUR_MAPBOX_KEY_HERE',
        center: this.coordinates, 
        zoom: 12, 
        minZoom: 5,
        maxZoom: 15,
        attributionControl: false,
      }); 

      map.on('load', () => {
        // Add a new source from our GeoJSON data
        map.addSource('single-point', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.geo,
          },
        });

        // Add SVG Marker
        this.geo.forEach((feature: { geometry: { coordinates: any; }; properties: any; }) => {
          const { coordinates } = feature.geometry;
          const properties = feature.properties;
      
          const svgMarker = `
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M44.8923 18.9413C44.9798 19.9791 44.9673 21.0169 44.8923 22.0547C44.8423 22.6924 44.7422 23.3176 44.6172 23.9428C43.2043 30.8949 39.3781 35.9714 32.9512 39.0348C31.6133 39.6725 30.4254 40.4477 29.5877 41.6981C28.6624 43.086 27.7746 44.5115 26.8368 45.8869C26.2867 46.6996 25.8615 47.6499 24.8237 48C24.5362 48 24.2361 48 23.9485 48C23.6234 47.7249 23.2108 47.4999 22.9732 47.1623C21.8103 45.4993 20.6475 43.8237 19.5597 42.1107C18.7719 40.8604 17.7591 39.8851 16.4212 39.2974C13.1077 37.8094 10.2819 35.7088 8.11872 32.7704C4.20504 27.4438 3.09221 21.5295 4.7302 15.1401C5.83053 10.8138 8.20624 7.23775 11.7198 4.47441C16.4962 0.698279 21.9354 -0.664631 27.9247 0.298159C31.9384 0.948354 35.4519 2.69888 38.4153 5.49972C41.3412 8.27556 43.3543 11.5891 44.2796 15.5277C44.5422 16.6531 44.7922 17.7909 44.8923 18.9413ZM24.4736 10.0261C18.7469 10.0011 13.983 14.7025 14.0205 20.4292C14.058 26.1934 18.4968 30.7448 24.0735 30.8824C30.2379 31.0324 34.8142 26.3685 34.8893 20.4917C34.9643 14.5775 30.1628 10.0636 24.4736 10.0261Z" fill="#9B8247"/>
          </svg>`;
      
          const encodedSvgMarker = encodeURIComponent(svgMarker);
      
          const markerElement = document.createElement('div');
          markerElement.style.width = '48px';
          markerElement.style.height = '48px';
          markerElement.style.backgroundImage = `url("data:image/svg+xml;charset=UTF-8,${encodedSvgMarker}")`;
          markerElement.style.backgroundSize = 'contain';
          markerElement.style.cursor = 'pointer';
      
          // Adjust marker's position so that the bottom center aligns with the coordinates
          markerElement.style.transform = 'translate(-50%, -100%)';
      
          new mapboxgl.Marker(markerElement)
            .setLngLat(coordinates as [number, number])
            .addTo(map);
      });
      
      
      });
    });
  }

  navigateToDetailsPopup(stub: string) {
    this.navigationService.navigateToPropertyDetails(stub);
  }

  onKeyPress(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode);

    if (!/^\d$/.test(inputChar)) {
      event.preventDefault(); // Prevent the character from being entered
    }
  }

 
  slideConfig = {
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    infinite: true,
    asNavFor: '.slider-nav', // Class of the synchronized carousel
    responsive: [
      {
        breakpoint: 768, // Apply the following settings for screens less than 1200px in width
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

}
