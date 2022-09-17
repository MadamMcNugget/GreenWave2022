import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotersAddComponent } from './voters-add.component';

describe('VotersAddComponent', () => {
  let component: VotersAddComponent;
  let fixture: ComponentFixture<VotersAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotersAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
