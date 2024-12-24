import { ObjectId } from "mongoose";
import { v4 as uuid } from "uuid";
export interface ISubscription {
  id: string;
}

export interface customBtn {
  text: string;
}

export interface InputTextProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSelected: boolean; // New property for radio button state
  onRadioSelect: () => void; // New property for handling radio button selection
}

// export interface objectiveProps {
//   code: string;
// }
export interface notifyProps {
  text: string;
}

export interface objectiveProps {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  examCode: string | null;
}

export interface subjectProps {
  question: string
}

export interface createObjProps {
  number: number;
}

export interface IQuestionProps {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  examCode?: string | null;
}
