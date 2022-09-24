import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule( {
	exports: [
		MatToolbarModule,
		MatMenuModule,
		MatButtonModule,
		MatTableModule,
		MatRadioModule,
		MatIconModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatGridListModule,
		MatChipsModule,
		MatSelectModule,
		MatPaginatorModule,
		MatSortModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatTabsModule,
		MatListModule,
		MatCheckboxModule,
		MatAutocompleteModule,
		MatSidenavModule,
		MatSnackBarModule,
		MatDialogModule,
		MatTooltipModule,
		MatStepperModule,
		MatSlideToggleModule,
		MatExpansionModule,
		MatProgressBarModule,

		DragDropModule,
		TextFieldModule,
		ScrollingModule,
		LayoutModule
	]
} )

export class AngularMaterialModule { }