// import { Component, signal } from '@angular/core';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterModule],
//   template: `<router-outlet></router-outlet>`,
//   styleUrls: ['./app.scss']
// })
// export class App {
//   protected readonly title = signal('map-box');
// }

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],  // must import RouterModule
    templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {}

