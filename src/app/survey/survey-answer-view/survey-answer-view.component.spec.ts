import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyAnswerViewComponent } from './survey-answer-view.component';

describe('SurveyAnswerViewComponent', () => {
  let component: SurveyAnswerViewComponent;
  let fixture: ComponentFixture<SurveyAnswerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyAnswerViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyAnswerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
