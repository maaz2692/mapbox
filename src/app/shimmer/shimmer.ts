import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shimmer',
  standalone: true,
  templateUrl: './shimmer.html',
  styleUrls: ['./shimmer.scss'],
})
export class ShimmerComponent {
  @Input() showShimmer: boolean = false;

  @Output() shimmerComplete: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit() {
  }
}
