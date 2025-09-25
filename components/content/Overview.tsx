
import React from 'react';
import { CourseOverview } from '../../types';

interface OverviewProps {
    overview: CourseOverview;
}

const Overview: React.FC<OverviewProps> = ({ overview }) => {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="!text-3xl font-bold !mb-4 border-b pb-2 border-slate-200 dark:border-slate-700">Course Overview</h2>
            <p>{overview.description}</p>

            <h3 className="!mt-8 !mb-3">Learning Objectives</h3>
            <ul className="list-disc pl-5 space-y-1">
                {overview.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
            </ul>

            <h3 className="!mt-8 !mb-3">Prerequisites</h3>
            <ul className="list-disc pl-5 space-y-1">
                {overview.prerequisites.map((req, i) => <li key={i}>{req}</li>)}
            </ul>
            
            <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <p className="!my-0">
                    <strong>Estimated Duration:</strong> {overview.durationHours} hours
                </p>
            </div>
        </div>
    );
};

export default Overview;