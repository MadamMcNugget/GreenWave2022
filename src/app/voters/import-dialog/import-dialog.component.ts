import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';

import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

import { Voter } from '../voter.model';
import { CsvColumnToVoterMap, CsvColumnNames, ImportStatus } from '../../constants';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})

export class ImportDialogComponent implements OnInit {

	isLoading: boolean = false;
	importedVoters: Voter[] = [];
	header: boolean = true;
	progressValue: number = 0;
	totalLines: number = 0;
	parsing: boolean = false;

	files: any[] = [];
	file_selection_form: UntypedFormGroup;

  constructor(
		public dialogRef: MatDialogRef<ImportDialogComponent>,
		private ngxCsvParser: NgxCsvParser,
	) { 
		this.file_selection_form = new UntypedFormGroup( {
			file_selection: new UntypedFormControl()
		} );
	}

  ngOnInit(): void {
  }

	calculateProgress( progress: number, total: number ){
		this.progressValue = progress / total * 100;
	}

	createVoters( csvLines: any ) {

		this.progressValue = 0;

		for( let i = 0; i < csvLines.length ; i++ ){
			this.calculateProgress( i+1, csvLines.length );
			console.log( `Progress: ${ this.progressValue }%, ${ i }/${ csvLines.length }` );

			const csvLine = csvLines[ i ];
			this.createVoter( csvLine, i + 1 );

		}
	}

	createVoter( csvLine: any, order: number ) {

		console.log( 'Voter csv: ', csvLine );

		let voter: Voter = {} as Voter;

		voter = {
			name: csvLine[ CsvColumnNames.NAME ],
			propertyAddress: csvLine[ CsvColumnNames.PROPERTY_ADDRESS ],
			houseNum: csvLine[ CsvColumnNames.STREET_NUMBER ],
			streetSuffix: csvLine[ CsvColumnNames.STREET_NUMBER_SUFFIX ],
			streetName: csvLine[ CsvColumnNames.STREET_NAME ],
			streetType: csvLine[ CsvColumnNames.STREET_TYPE ],
			aptNum: csvLine[ CsvColumnNames.UNIT_NUMBER ],
			city: 'Burnaby',
			support: '',
			answers: [],
			canvassedBy: '',
			canvassedDate: null,
			status: ImportStatus.IMPORT_SUCCESS,
			id: '',
			electorId: csvLine[ CsvColumnNames.ELECTOR_ID ],
			rc: csvLine[ CsvColumnNames.RC ],
			voted: ( csvLine[ CsvColumnNames.VOTED ] == "N" ? false : true ),
			locationName: csvLine[ CsvColumnNames.LOCATION_NAME ],
			recordedDate: csvLine[ CsvColumnNames.RECORDED_DATE ],
			votingChannel: csvLine[ CsvColumnNames.VOTING_CHANNEL ],
			order: order
		}

		this.importedVoters.push( voter );
		console.log( 'Adding voter: ', voter );
	}

	//----------------------------------------------------------------------

	/**
	 * on file drop handler
	 */
	 onFileDropped( $event: any ) {
		this.prepareFilesList( $event );
	}

	/**
	 * handle file from browsing
	 */
	fileBrowseHandler( event: any ) {

		this.prepareFilesList( event.target.files );
	}

	/**
	 * Delete file from files list
	 * @param index (File index)
	 */
	deleteFile( index: number ) {
		if ( this.progressValue > 0 && this.progressValue < 100 ) {
			console.log( "Upload in progress." );
			return;
		}
		this.files.splice( index, 1 );
	}

	/**
	 * Convert Files list to normal array list
	 * @param files (Files List)
	 */
	prepareFilesList( files: Array<any> ) {
		for ( const item of files ) {
			if ( !item.name.endsWith( '.csv' ) ) {
				alert( `Selected file '${ item.name }' is not a csv file ... Please import valid .csv file.` );
			}
			else {
				item.progress = 0;
				this.files.push( item );
			}
		}
	}

	/**
	 * format bytes
	 * @param bytes (File size in bytes)
	 * @param decimals (Decimals point)
	 */
	formatBytes( bytes: number, decimals = 2 ) {
		if ( bytes === 0 ) {
			return "0 Bytes";
		}
		const k = 1024;
		const dm = decimals <= 0 ? 0 : decimals;
		const sizes = [ "Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ];
		const i = Math.floor( Math.log( bytes ) / Math.log( k ) );
		return parseFloat( ( bytes / Math.pow( k, i ) ).toFixed( dm ) ) + " " + sizes[ i ];
	}


	// OnClick of button Upload
	// **** Make sure that the header line column names are trimmed (no spaces before or after) ****
	onUpload() {
		this.header = ( this.header as unknown as string ) === 'true' || this.header === true;

		this.parsing = true;

		this.ngxCsvParser.parse( this.files[ 0 ], { header: this.header, delimiter: ',' } )
			.pipe().subscribe( {
				next: ( result ): void => {
					console.log( 'Result', result );
					this.parsing = false;
					this.createVoters( result );
					this.isLoading = true;
					this.closeDialog();
				},
				error: ( error: NgxCSVParserError ): void => {
					console.log( 'Error', error );
					this.isLoading = true;
				}
				, complete: () => {
				}
			} );

	}

	closeDialog() {
		this.dialogRef.close( this.importedVoters );
	}

}
