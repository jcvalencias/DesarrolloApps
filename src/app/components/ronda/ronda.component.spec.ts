import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RondaComponent } from './ronda.component';

describe('RondaComponent', () => {
  let component: RondaComponent;
  let fixture: ComponentFixture<RondaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RondaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RondaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
