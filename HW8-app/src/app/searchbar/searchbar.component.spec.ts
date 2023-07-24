import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { searchbarComponent } from './searchbar.component';

describe('searchbarComponent', () => {
  let component: searchbarComponent;
  let fixture: ComponentFixture<searchbarComponent>;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        searchbarComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(searchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
