import React from 'react';
import { GlossaryItem } from '../../types';

interface GlossaryViewProps {
    glossary: GlossaryItem[];
}

const GlossaryView: React.FC<GlossaryViewProps> = ({ glossary }) => {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="!text-3xl font-bold !mb-4 border-b pb-2 border-slate-200 dark:border-slate-700">Glossary</h2>
            <dl className="space-y-6">
                {glossary.map((item, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                        <dt className="font-bold text-xl text-slate-900 dark:text-white">{item.term}</dt>
                        <dd className="mt-1 text-slate-600 dark:text-slate-300">{item.definition}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
};

export default GlossaryView;
