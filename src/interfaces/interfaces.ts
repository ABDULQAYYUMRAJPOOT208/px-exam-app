export interface ISubscription {
  id: string;
}

export interface customBtn {
  text: string;
}

export interface InputTextProps {
  value: string; // Prop for the input value
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Prop for handling changes
}
// export interface objectiveProps {
//   code: string;
// }
export interface notifyProps {
  text: string;
}

export interface objectiveProps {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface subjectProps {
    question:string
}

export interface createObjProps {
  number: number;
}
