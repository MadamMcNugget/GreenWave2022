import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindVotersComponent } from './find-voters.component';

describe('FindVotersComponent', () => {
  let component: FindVotersComponent;
  let fixture: ComponentFixture<FindVotersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindVotersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindVotersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
