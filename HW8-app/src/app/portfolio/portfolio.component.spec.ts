import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { portfolioComponent } from './portfolio.component';

describe('detailsComponent', () => {
  let component: portfolioComponent;
  let fixture: ComponentFixture<portfolioComponent>;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        portfolioComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(portfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
