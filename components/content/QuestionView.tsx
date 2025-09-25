
import React, { useState } from 'react';
// FIX: AIFeedback is not exported from geminiService. It must be imported from `types` where it is defined.
import { QuizQuestion, AIFeedback } from '../../types';
import { useCourse } from '../../hooks/useCourse';
import { validateShortAnswer } from '../../services/geminiService';

interface QuestionViewProps {
    question: QuizQuestion;
    index: number;
}

const QuestionView: React.FC<QuestionViewProps> = ({ question, index }) => {
    const { saveQuizAnswer, progress } = useCourse();

    const initialAnswer = progress.quizAnswers[question.id];
    const safeInitialAnswer = typeof initialAnswer === 'string' ? initialAnswer : null;

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(safeInitialAnswer);
    const [userShortAnswer, setUserShortAnswer] = useState<string>(safeInitialAnswer || '');
    const [aiFeedback, setAIFeedback] = useState<AIFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnswered, setIsAnswered] = useState(!!progress.quizAnswers[question.id]);

    const handleSelect = (choice: string) => {
        if (isAnswered) return;
        setSelectedAnswer(choice);
        setIsAnswered(true);
        saveQuizAnswer(question.id, choice);
    };

    const handleShortAnswerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userShortAnswer.trim() || isLoading) return;
        
        setIsLoading(true);
        const feedback = await validateShortAnswer(question.prompt, question.answer, userShortAnswer);
        setAIFeedback(feedback);
        setIsLoading(false);
        setIsAnswered(true);
        saveQuizAnswer(question.id, userShortAnswer);
    };

    const getOptionClass = (choice: string) => {
        if (!isAnswered) {
            return "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600";
        }
        if (choice === question.answer) {
            return "bg-green-100 dark:bg-green-900 border-green-500 ring-2 ring-green-500";
        }
        if (choice === selectedAnswer && choice !== question.answer) {
            return "bg-red-100 dark:bg-red-900 border-red-500 ring-2 ring-red-500";
        }
        return "bg-slate-100 dark:bg-slate-700 opacity-70";
    };

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                <span className="text-teal-600 dark:text-teal-400 mr-2">{index}.</span>
                {question.prompt}
            </p>

            {question.type === 'mcq' && question.choices && (
                <div className="mt-4 space-y-3">
                    {question.choices.map((choice) => (
                        <button
                            key={choice}
                            onClick={() => handleSelect(choice)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-lg border border-transparent transition-all duration-200 ${getOptionClass(choice)} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {choice}
                        </button>
                    ))}
                </div>
            )}
            
            {question.type === 'true_false' && (
                 <div className="mt-4 space-y-3">
                    {['True', 'False'].map((choice) => (
                        <button
                            key={choice}
                            onClick={() => handleSelect(choice.toLowerCase())}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-lg border border-transparent transition-all duration-200 ${getOptionClass(choice.toLowerCase())} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {choice}
                        </button>
                    ))}
                </div>
            )}
            
            {question.type === 'short_answer' && (
                <form onSubmit={handleShortAnswerSubmit} className="mt-4">
                    <textarea
                        value={userShortAnswer}
                        onChange={(e) => setUserShortAnswer(e.target.value)}
                        disabled={isAnswered || isLoading}
                        rows={3}
                        className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        placeholder="Your answer..."
                    />
                    {!isAnswered && (
                        <button
                            type="submit"
                            disabled={isLoading || !userShortAnswer.trim()}
                            className="mt-3 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-sm hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Evaluating...' : 'Submit Answer'}
                        </button>
                    )}
                </form>
            )}

            {isAnswered && question.rationale && question.type !== 'short_answer' && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border-l-4 border-teal-500">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Rationale</p>
                    <p className="text-slate-600 dark:text-slate-300">{question.rationale}</p>
                </div>
            )}
            
            {aiFeedback && (
                 <div className={`mt-4 p-4 rounded-lg border-l-4 ${aiFeedback.isCorrect ? 'bg-green-50 dark:bg-green-900/50 border-green-500' : 'bg-red-50 dark:bg-red-900/50 border-red-500'}`}>
                    <p className="font-bold">{aiFeedback.isCorrect ? '✅ Correct' : '🔍 Needs Review'}</p>
                    <p>{aiFeedback.feedback}</p>
                 </div>
            )}

        </div>
    );
};

export default QuestionView;