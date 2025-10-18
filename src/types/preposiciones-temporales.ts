export interface PreposicionTemporalExercise {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: {
    preposition: string;
    case: string;
    timeUnit: string;
    explanation: string;
  };
}

export interface PreposicionTemporalCloze {
  id: string;
  expectedAnswer: string;
  context: {
    preposition: string;
    case: string;
    timeUnit: string;
    explanation: string;
  };
}

export interface PreposicionTemporalParagraph {
  id: string;
  germanText: string;
  clozes: PreposicionTemporalCloze[];
}

export interface PreposicionTemporalWorkshop {
  workshopId: string;
  sections: {
    warmup: PreposicionTemporalExercise[];
    central: PreposicionTemporalExercise[];
    narrative: PreposicionTemporalParagraph[];
  };
}

