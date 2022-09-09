import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteersViewComponent } from './volunteers-view.component';

describe('VolunteersViewComponent', () => {
  let component: VolunteersViewComponent;
  let fixture: ComponentFixture<VolunteersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolunteersViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
