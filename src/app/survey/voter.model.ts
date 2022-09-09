export interface Voter{
	[ x: string ]: any;
	poll: number;
	sequence: number;
	name: string;
	streetName: string;
	houseNum: string;
	aptNum: string;
	city: string;
	support: string;
	answers:{
		question: string,
		answer: string[]
	}[]
	canvassedBy: string,
	canvassedDate: Date | null,
	status: string,
	needsManualEntry: boolean,
	GVoteLink: string,
	id: string
}
