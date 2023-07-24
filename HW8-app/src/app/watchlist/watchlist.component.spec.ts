import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { watchlistComponent } from './watchlist.component';

describe('detailsComponent', () => {
  let component: watchlistComponent;
  let fixture: ComponentFixture<watchlistComponent>;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        watchlistComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(watchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
