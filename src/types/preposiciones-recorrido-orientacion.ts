export interface PreposicionRecorridoExercise {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: {
    preposition: string;
    case: string;
    type: string;
    gender: string;
    explanation: string;
  };
}

export interface PreposicionRecorridoCloze {
  id: string;
  expectedAnswer: string;
  context: {
    preposition: string;
    case: string;
    type: string;
    gender: string;
    explanation: string;
  };
}

export interface PreposicionRecorridoParagraph {
  id: string;
  germanText: string;
  clozes: PreposicionRecorridoCloze[];
}

export interface PreposicionRecorridoWorkshop {
  workshopId: string;
  sections: {
    warmup: PreposicionRecorridoExercise[];
    central: PreposicionRecorridoExercise[];
    narrative: PreposicionRecorridoParagraph[];
  };
}
