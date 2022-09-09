import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteersCreateComponent } from './volunteers-create.component';

describe('VolunteersCreateComponent', () => {
  let component: VolunteersCreateComponent;
  let fixture: ComponentFixture<VolunteersCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolunteersCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
