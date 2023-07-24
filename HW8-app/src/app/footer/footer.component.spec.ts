import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { footerComponent } from './footer.component';

describe('navbarComponent', () => {
  let component: footerComponent;
  let fixture: ComponentFixture<footerComponent>;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        footerComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(footerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
