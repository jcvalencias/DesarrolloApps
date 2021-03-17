import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlvideClaveComponent } from './olvide-clave.component';

describe('OlvideClaveComponent', () => {
  let component: OlvideClaveComponent;
  let fixture: ComponentFixture<OlvideClaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlvideClaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlvideClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
