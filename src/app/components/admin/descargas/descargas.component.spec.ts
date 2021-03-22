import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargasComponent } from './descargas.component';

describe('DescargasComponent', () => {
  let component: DescargasComponent;
  let fixture: ComponentFixture<DescargasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescargasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescargasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
