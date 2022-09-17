import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotersViewAllComponent } from './voters-view-all.component';

describe('VotersViewAllComponent', () => {
  let component: VotersViewAllComponent;
  let fixture: ComponentFixture<VotersViewAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotersViewAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotersViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
