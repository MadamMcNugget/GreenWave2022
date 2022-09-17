import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AngularMaterialModule } from './../angular-material.module';
import { VotersAddComponent } from './voters-add/voters-add.component';
import { VotersViewAllComponent } from './voters-view-all/voters-view-all.component';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';

import { DragAndDropDirective } from './import-dialog/drag-and-drop.directive';

@NgModule({
  declarations: [
    VotersAddComponent,
    VotersViewAllComponent,
    ImportDialogComponent,
		DragAndDropDirective
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
