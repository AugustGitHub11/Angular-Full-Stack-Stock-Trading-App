import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { searchdetailsComponent } from './searchdetails.component';

describe('searchdetailsComponent', () => {
  let component: searchdetailsComponent;
  let fixture: ComponentFixture<searchdetailsComponent>;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        searchdetailsComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(searchdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
