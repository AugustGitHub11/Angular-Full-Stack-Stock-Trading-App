import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { detailsComponent } from './details.component';

describe('detailsComponent', () => {
  let component: detailsComponent;
  let fixture: ComponentFixture<detailsComponent>;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        detailsComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(detailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
