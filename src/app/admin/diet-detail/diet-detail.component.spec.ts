import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DietDetailComponent } from './diet-detail.component';

describe('DietDetailComponent', () => {
  let component: DietDetailComponent;
  let fixture: ComponentFixture<DietDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DietDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DietDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
