import React, { useState } from 'react';
import { Lesson } from '../../types';
import { useCourse } from '../../hooks/useCourse';
import QuizView from './QuizView';
import { getExerciseFeedback } from '../../services/geminiService';
import { AITutorFeedback } from '../../types';

interface LessonViewProps {
    lesson: Lesson;
}

const Exercise: React.FC<{ exercise: Lesson['exercises'][0], index: number }> = ({ exercise, index }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<AITutorFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim() || isLoading) return;

        setIsLoading(true);
        const result = await getExerciseFeedback(exercise.task, exercise.solution, userAnswer);
        setFeedback(result);
        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <div className="p-4 border rounded-lg mt-4 bg-slate-50 dark:bg-slate-800 not-prose">
            <p className="font-semibold">Exercise {index + 1}:</p>
            <p className="mb-4">{exercise.task}</p>
            
            <form onSubmit={handleSubmit}>
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isSubmitted || isLoading}
                    rows={4}
                    className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    placeholder="Type your answer here..."
                    aria-label={`Answer for exercise ${index + 1}`}
                />
                {!isSubmitted && (
                    <button
                        type="submit"
                        disabled={isLoading || !userAnswer.trim()}
                        className="mt-3 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-sm hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Getting feedback...' : 'Correct my answer'}
                    </button>
                )}
            </form>

            {isSubmitted && feedback && (
                <div className="mt-4">
                    <div className="p-4 rounded-lg border-l-4 border-teal-500 bg-teal-50 dark:bg-teal-900/50">
                        <p className="font-bold text-teal-800 dark:text-teal-200">Feedback</p>
                        <p>{feedback.feedback}</p>
                    </div>
                    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded">
                        <p className="font-semibold text-sm">Example Solution:</p>
                        <p className="text-sm">{exercise.solution}</p>
                    </div>
                </div>
            )}
        </div>
    );
};


const LessonView: React.FC<LessonViewProps> = ({ lesson }) => {
    const { markLessonAsComplete, progress } = useCourse();
    const isCompleted = progress.completedLessons.includes(lesson.id);

    return (
        <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="!text-3xl font-bold !mb-4">{lesson.title}</h2>
            <p className="lead !text-xl !text-slate-600 dark:!text-slate-400">{lesson.summary}</p>
            
            {lesson.outcomes && lesson.outcomes.length > 0 && (
                 <>
                    <h3 className="!mt-8 !mb-3">Learning Outcomes</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {lesson.outcomes.map((outcome, i) => <li key={i}>{outcome}</li>)}
                    </ul>
                </>
            )}

            {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
                 <>
                    <h3 className="!mt-8 !mb-3">Key Concepts</h3>
                    <div className="flex flex-wrap gap-2">
                        {lesson.keyConcepts.map((concept, i) => <span key={i} className="bg-teal-100 text-teal-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-teal-900 dark:text-teal-300">{concept}</span>)}
                    </div>
                </>
            )}

            <div className="mt-8">
                {lesson.content.map((contentPart, i) => (
                    <div key={i}>
                        <h3 className="!mt-8 !mb-3">{contentPart.heading}</h3>
                        <p>{contentPart.body}</p>
                    </div>
                ))}
            </div>

            {lesson.examples && lesson.examples.length > 0 && (
                <>
                    <h3 className="!mt-12 !mb-4">Examples</h3>
                    {lesson.examples.map((example, i) => (
                        <div key={i} className="mb-6 p-4 border-l-4 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 not-prose rounded-r-lg">
                            <p className="font-bold text-lg">{example.title}</p>
                            <p className="mt-2">{example.body}</p>
                        </div>
                    ))}
                </>
            )}

            {lesson.exercises && lesson.exercises.length > 0 && (
                 <>
                    <h3 className="!mt-12 !mb-4">Exercises</h3>
                    {lesson.exercises.map((exercise, i) => (
                        <Exercise key={`${lesson.id}-exercise-${i}`} exercise={exercise} index={i} />
                    ))}
                </>
            )}
            
            {lesson.quiz && lesson.quiz.length > 0 && (
                <div className="mt-12">
                   <QuizView quiz={lesson.quiz} title="Lesson Quiz" isLessonQuiz={true} />
                </div>
            )}
            
            <div className="mt-12 text-center">
                <button
                    onClick={() => markLessonAsComplete(lesson.id)}
                    disabled={isCompleted}
                    className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 disabled:bg-green-600 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900"
                >
                    {isCompleted ? '✓ Completed' : 'Mark as Complete'}
                </button>
            </div>
        </div>
    );
};

export default LessonView;
