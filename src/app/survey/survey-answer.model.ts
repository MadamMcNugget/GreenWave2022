export interface SurveyAnswer {
	idOfRespondant: string;
	submittedBy: string;
	answers: {
		question: string,
		answer: string[]
	}[];
}
