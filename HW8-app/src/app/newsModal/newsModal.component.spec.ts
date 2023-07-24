import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { newsModalComponent } from './newsModal.component';

describe('newsModalComponent', () => {
  let component: newsModalComponent;
  let fixture: ComponentFixture<newsModalComponent>;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
      declarations: [
        newsModalComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(newsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
