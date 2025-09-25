export interface Course {
    id: string;
    title: string;
    language: string;
    audience: string;
    level: string;
    overview: CourseOverview;
    lessons: Lesson[];
    finalQuiz: QuizQuestion[];
    resources: Resource[];
    glossary: GlossaryItem[];
    nextSteps: string[];
}

export interface CourseOverview {
    description: string;
    prerequisites: string[];
    durationHours: number;
    learningObjectives: string[];
}

export interface Lesson {
    id: string;
    title: string;
    summary: string;
    outcomes: string[];
    keyConcepts: string[];
    content: Array<{
        heading: string;
        body: string;
    }>;
    examples: Array<{
        title: string;
        body: string;
    }>;
    exercises: Array<{
        task: string;
        solution: string;
    }>;
    quiz: QuizQuestion[];
}

export type QuestionType = 'mcq' | 'true_false' | 'short_answer';

export interface QuizQuestion {
    id: string;
    type: QuestionType;
    prompt: string;
    choices?: string[];
    answer: string;
    rationale: string;
}

export interface Resource {
    title: string;
    url: string;
    note: string;
}

export interface GlossaryItem {
    term: string;
    definition: string;
}

export interface Progress {
    completedLessons: string[];
    quizAnswers: { [questionId: string]: string };
}

// AI Service Types
export interface AIFeedback {
    isCorrect: boolean;
    feedback: string;
}

export interface AITutorFeedback {
    feedback: string;
}
