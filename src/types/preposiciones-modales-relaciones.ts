export interface PreposicionModalRelacionalExercise {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: {
    preposition: string;
    case: string;
    meaning: string;
    explanation: string;
  };
}

export interface PreposicionModalRelacionalCloze {
  id: string;
  expectedAnswer: string;
  context: {
    preposition: string;
    case: string;
    meaning: string;
    explanation: string;
  };
}

export interface PreposicionModalRelacionalParagraph {
  id: string;
  germanText: string;
  clozes: PreposicionModalRelacionalCloze[];
}

export interface PreposicionModalRelacionalWorkshop {
  workshopId: string;
  sections: {
    warmup: PreposicionModalRelacionalExercise[];
    central: PreposicionModalRelacionalExercise[];
    narrative: PreposicionModalRelacionalParagraph[];
  };
}
