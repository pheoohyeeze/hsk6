
export interface Question {
  id: number;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'passage' | 'writing';
  passage?: string; 
  question: string;
  options?: { [key: string]: string }; 
}

export interface SectionPart {
    title: string;
    instructions: string;
    passage?: string;
    questions: Question[];
}

export interface Section {
  title: string;
  subtitle: string;
  parts: SectionPart[];
}

export interface UserAnswers {
  [questionId: number]: string;
}

export interface Exam {
  id: string;
  name: string;
  duration: number; // Duration in minutes
  data: Section[];
  answerKey: { [key: number]: string };
}