export interface Voter{
	[ x: string ]: any;
	name: string;
	propertyAddress: string,
	houseNum: string;
	streetSuffix: string,
	streetName: string;
	streetType: string,
	aptNum: string;
	city: string;
	support: string;
	answers:{
		question: string,
		answer: string[]
	}[]
	canvassedBy: string,
	canvassedDate: Date | null,
	id: string,
	
	electorId: number,
	rc: string,
	voted: boolean,
	locationName: string,
	recordedDate: string,
	votingChannel: string,

	order: number,
	status: string,
}
