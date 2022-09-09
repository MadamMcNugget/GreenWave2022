import { Question } from './questions/question.model';

export interface Survey {
	id: string;
	edittedBy: string;
	section: {
		id: string,
		title: string,
		step: number,
		questions: Question[]
	}[];
}
