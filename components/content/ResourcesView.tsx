
import React from 'react';
import { Resource } from '../../types';

interface ResourcesViewProps {
    resources: Resource[];
}

const ResourcesView: React.FC<ResourcesViewProps> = ({ resources }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-4 border-b pb-2 border-slate-200 dark:border-slate-700">Resources</h2>
            <div className="space-y-4">
                {resources.map((resource, index) => (
                    <div key={index}>
                        <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <h4 className="font-bold text-teal-600 dark:text-teal-400">{resource.title}</h4>
                            <p className="text-slate-600 dark:text-slate-300 mt-1">{resource.note}</p>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResourcesView;