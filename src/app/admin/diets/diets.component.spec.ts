import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DietsComponent } from './diets.component';

describe('DietsComponent', () => {
  let component: DietsComponent;
  let fixture: ComponentFixture<DietsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DietsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DietsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
