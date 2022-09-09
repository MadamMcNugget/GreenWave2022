export interface Question {
	id: string | null;
	question: string;
	responseType: string;	// choose from ["checkbox", "radio", "text"]
	responses: {
		id: string | null,
		response: string,
		goto: string
	}[];	// items users can choose from. empty is response type is 'text'
	gotoEnabled: boolean;
	edittable: boolean;
}

/***********
	Response Format
	-----------------

	if checkbox
		{
			[false,true, false,false],
			[true, false,true, true ],
			...
		}\

	if radio
		{ 'option 1', 'option 3', 'option 3', ....}
*/