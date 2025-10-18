export interface PreposicionDestinoProcedenciaExercise {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: {
    preposition: string;
    case: string;
    gender: string;
    type: string; // "destino" | "procedencia" | "ubicacion"
    explanation: string;
  };
}

export interface PreposicionDestinoProcedenciaCloze {
  id: string;
  expectedAnswer: string;
  context: {
    preposition: string;
    case: string;
    gender: string;
    type: string;
    explanation: string;
  };
}

export interface PreposicionDestinoProcedenciaParagraph {
  id: string;
  germanText: string;
  clozes: PreposicionDestinoProcedenciaCloze[];
}

export interface PreposicionDestinoProcedenciaWorkshop {
  workshopId: string;
  sections: {
    warmup: PreposicionDestinoProcedenciaExercise[];
    central: PreposicionDestinoProcedenciaExercise[];
    narrative: PreposicionDestinoProcedenciaParagraph[];
  };
}
