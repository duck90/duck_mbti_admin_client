export interface IMbtiPoint {
  EI: number;
  SN: number;
  TF: number;
  JP: number;
}
export interface IMbtiQuestion extends IMbtiPoint {
  question: string;
  type: "radio" | "level";
  answer: string[];
}

export interface ITest {
  active: boolean;
  createdAt: string;
  description: string;
  id: number;
  order_no: number;
  question_count: number;
  subtitle: string;
  title: string;
  updatedAt: string;
  results: ITestResult[];
}

export interface ITestResult {
  createdAt: string;
  id: number;
  mbti: string;
  subject_id: number;
  updatedAt: string;
  url: string;
}

export interface ITestDetail extends ITest {
  questions: {
    id: number;
    type: "radio" | "level";
    order_no: number;
    question: string;
    answer: string;
    EI_point: number;
    SN_point: number;
    TF_point: number;
    JP_point: number;
  }[];
}
