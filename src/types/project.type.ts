export interface Option {
  idOpc: number;
  idp: number;
  txtOpc: string;
}

export enum QuestionType {
  TEXT = "TEXT",
  SINGLECHOICE = "SINGLECHOICE",
  MULTIPLECHOICE = "MULTIPLECHOICE",
  DROPDOWN = "DROPDOWN",
  FILE = "FILE",
  NUMBER = "NUMBER",
  DATE = "DATE"
}

export interface Question {
  idp: number;
  opcs: Option[];
  nmPrg: string;
  type: QuestionType;
}

export type AnswerValue = string | number | number[] | File | null;

export interface Answers {
  [key: number]: AnswerValue;
}

export interface Errors {
  [key: number]: string | null;
}