import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AngularMaterialModule } from './../angular-material.module';
import { QuestionCreateComponent } from './questions/question-create/question-create.component';
import { SurveyViewComponent } from './survey-view/survey-view.component';
import { SurveyCreateComponent } from './survey-create/survey-create.component';
import { FindVotersComponent } from './find-voters/find-voters.component';
import { SurveyAnswerViewComponent } from './survey-answer-view/survey-answer-view.component';

@NgModule({
  declarations: [
    QuestionCreateComponent,
    SurveyViewComponent,
    SurveyCreateComponent,
    FindVotersComponent,
    SurveyAnswerViewComponent
  ],
  imports: [
    CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		AngularMaterialModule
  ]
})
export class SurveyModule { }
