
import React from 'react';
import { QuizQuestion } from '../../types';
import QuestionView from './QuestionView';

interface QuizViewProps {
    quiz: QuizQuestion[];
    title: string;
    isLessonQuiz?: boolean;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, title, isLessonQuiz = false }) => {
    if (!quiz || quiz.length === 0) {
        return null;
    }
    
    return (
        <div className={`mt-8 ${isLessonQuiz ? 'not-prose' : 'prose prose-lg dark:prose-invert max-w-none'}`}>
            <h3 className={`text-2xl font-bold mb-6 border-b pb-2 ${isLessonQuiz ? 'border-slate-300 dark:border-slate-600' : 'border-slate-200 dark:border-slate-700'}`}>{title}</h3>
            <div className="space-y-8">
                {quiz.map((question, index) => (
                    <QuestionView key={question.id} question={question} index={index + 1} />
                ))}
            </div>
        </div>
    );
};

export default QuizView;