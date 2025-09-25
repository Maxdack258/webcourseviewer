
import React from 'react';

interface NextStepsViewProps {
    nextSteps: string[];
}

const NextStepsView: React.FC<NextStepsViewProps> = ({ nextSteps }) => {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="!text-3xl font-bold !mb-4 border-b pb-2 border-slate-200 dark:border-slate-700">Next Steps</h2>
            <ol className="list-decimal pl-5 space-y-2">
                {nextSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default NextStepsView;