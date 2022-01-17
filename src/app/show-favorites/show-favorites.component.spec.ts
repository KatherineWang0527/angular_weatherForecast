import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFavoritesComponent } from './show-favorites.component';

describe('ShowFavoritesComponent', () => {
  let component: ShowFavoritesComponent;
  let fixture: ComponentFixture<ShowFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowFavoritesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
