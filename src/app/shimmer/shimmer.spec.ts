import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shimmer } from './shimmer';

describe('Shimmer', () => {
  let component: Shimmer;
  let fixture: ComponentFixture<Shimmer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shimmer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shimmer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
