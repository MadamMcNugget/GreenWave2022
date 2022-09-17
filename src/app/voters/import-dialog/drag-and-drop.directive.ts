import {
	Directive,
	Output,
	Input,
	EventEmitter,
	HostBinding,
	HostListener
} from '@angular/core';

@Directive( {
	selector: '[appDragAndDrop]'
} )
export class DragAndDropDirective {
	@HostBinding( 'class.fileover' ) fileOver: boolean;
	@Output() fileDropped = new EventEmitter<any>();

	constructor () { this.fileOver = false; }

	// Dragover listener
	@HostListener( 'dragover', [ '$event' ] ) onDragOver( evt: any ) {
		evt.preventDefault();
		evt.stopPropagation();
		this.fileOver = true;

		console.log( 'Drag Over' );
	}

	// Dragleave listener
	@HostListener( 'dragleave', [ '$event' ] ) onDragLeave( evt: any ) {
		evt.preventDefault();
		evt.stopPropagation();

		console.log( 'Drag Leave' );
	}

	// Drop listener
	@HostListener( 'drop', [ '$event' ] ) onDrop( evt: any ) {
		evt.preventDefault();
		evt.stopPropagation();

		this.fileOver = false;

		const files = evt.dataTransfer.files;

		if ( files.length > 0 ) {
			this.fileDropped.emit( files );
			console.log( `You dropped ${ files.length } files.` )
		}

		console.log( 'Drag Leave' );
	}
}
