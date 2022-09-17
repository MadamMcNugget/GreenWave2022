import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import { Voter } from 'src/app/voters/voter.model';
import { ExecutionStatus, ImportStatus } from 'src/app/constants';
import { VotersService } from '../voters.service';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';

@Component({
  selector: 'app-voters-add',
  templateUrl: './voters-add.component.html',
  styleUrls: ['./voters-add.component.css']
})
export class VotersAddComponent implements OnInit {

	dataSource = new MatTableDataSource<Voter>();
	columnsToDisplay = [ 'order', 'electorId', 'name', 'address', 'status' ];
	isLoading: boolean = false;
	executionFailedAt: number = 0;
	importedVoters: Voter[] = [];
	votersFailedToAdd: Voter[] = [];
	assignedOrder: number = 1;
	orderInProgress: number = 0;
	progressValue: number = 0;
	totalOperations: number = 0;
	successfulImportCount: number = 0;
	executionStatus: ExecutionStatus = ExecutionStatus.NOT_STARTED;
	readonly ExecutionStatus = ExecutionStatus;
	readonly ImportStatus = ImportStatus;

	@ViewChild( MatPaginator ) paginator!: MatPaginator;

  constructor(
		private importDialog: MatDialog,
		private _snackbar: MatSnackBar,
		private votersService: VotersService
	) { }

  ngOnInit(): void {
		this.dataSource.data = [];
  }

	importCsvFile() {
		console.log( 'Open import dialog' );
		
		const dialogRef = this.importDialog.open( ImportDialogComponent, {
			width: '90%'
		});

		dialogRef.afterClosed().subscribe( votersFromImport => {
			if( votersFromImport ){
				console.log( "Imported voters" );
				this.importedVoters = votersFromImport;
				this.dataSource.data = this.importedVoters;
				this.dataSource.paginator = this.paginator;
				this.totalOperations = votersFromImport.length;
				this.successfulImportCount = this.importedVoters.filter( voter => voter.status == ImportStatus.IMPORT_SUCCESS ).length;
				this.executionStatus = ExecutionStatus.IMPORTED;
			}
		})
	}

	resumeOperations() {
		console.log( `Resuming operation at order ${ this.executionFailedAt }`);
		this.executeOperations( this.executionFailedAt );
	}

	async executeOperations( startAtIndex: number ) {
		console.log( `Executing voter imports`, this.importedVoters );

		this.executionStatus = ExecutionStatus.IN_PROGRESS;

		for( let i = startAtIndex ; i < this.totalOperations ; i++ ) {
			let voter = this.importedVoters[i];
			voter.status = ImportStatus.EXECUTION_IN_PROGRESS;
			this.orderInProgress = voter.order;
			this.calculateProgress( i, this.totalOperations );

			console.log( `Processing voter ${ voter.order }/${ this.totalOperations }` );

			await new Promise<void>( (resolve, reject ) => {
				this.votersService.createVoter( voter ).subscribe({
					next: success => {
						console.log( 'success?', success );
						if( success.success ){
							voter.status = ImportStatus.EXECUTION_SUCCESS
						} else {
							voter.status = ImportStatus.EXECUTION_FAIL
							this.votersFailedToAdd.push( voter );
						}
					},
					error: error => {
						voter.status = ImportStatus.EXECUTION_FAIL
						this.votersFailedToAdd.push( voter );
					},
					complete: () => {
						resolve();
					}
				});
			});
		}

		this.orderInProgress = this.totalOperations;
		this.calculateProgress( this.totalOperations, this.totalOperations );

		this.executionStatus = ExecutionStatus.COMPLETE;
	}

	calculateProgress( progress: number, total: number ){
		this.progressValue = progress / total * 100;
	}
}
