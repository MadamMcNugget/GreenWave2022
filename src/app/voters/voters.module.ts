import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AngularMaterialModule } from './../angular-material.module';
import { VotersAddComponent } from './voters-add/voters-add.component';
import { VotersViewAllComponent } from './voters-view-all/voters-view-all.component';

@NgModule({
  declarations: [
    VotersAddComponent,
    VotersViewAllComponent
  ],
  imports: [
    CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		AngularMaterialModule
  ]
})
export class VotersModule { }
