export interface Volunteer {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	address: string;
	intake: boolean;
	// roles: {
	// 	footCanvass: boolean;
	// 	phoneCanvass: boolean;
	// 	office: boolean;
	// 	hosting: boolean;
	// 	events: boolean;
	// 	smc: boolean;
	// 	signposter: boolean;
	// 	photographer: boolean;
	// 	core:boolean;
	// }
	notes: string;
}
