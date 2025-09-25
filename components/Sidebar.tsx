
import React from 'react';
import { useCourse } from '../hooks/useCourse';
import { SECTION_IDS } from '../constants';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

const Sidebar: React.FC = () => {
    const { course, progress, activeSectionId, setActiveSectionId } = useCourse();

    const navItems = [
        { id: SECTION_IDS.OVERVIEW, title: 'Overview' },
        ...(course?.lessons.map(lesson => ({ id: lesson.id, title: lesson.title })) || []),
        { id: SECTION_IDS.FINAL_QUIZ, title: 'Final Quiz' },
        { id: SECTION_IDS.RESOURCES, title: 'Resources' },
        { id: SECTION_IDS.GLOSSARY, title: 'Glossary' },
        { id: SECTION_IDS.NEXT_STEPS, title: 'Next Steps' },
    ];

    return (
        <aside className="w-64 lg:w-72 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 overflow-y-auto">
            <nav className="space-y-2">
                {navItems.map(item => {
                    const isLesson = !Object.values(SECTION_IDS).includes(item.id);
                    const isCompleted = isLesson && progress.completedLessons.includes(item.id);
                    const isActive = activeSectionId === item.id;

                    const baseClasses = "flex items-center w-full text-left p-3 rounded-lg transition-colors duration-200";
                    const activeClasses = "bg-teal-100 dark:bg-slate-700 text-teal-700 dark:text-teal-300 font-semibold";
                    const inactiveClasses = "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300";
                    const completedClasses = "text-slate-400 dark:text-slate-500 line-through";

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveSectionId(item.id)}
                            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                        >
                            <span className="flex-shrink-0 w-6 h-6 mr-3">
                                {isCompleted ? <CheckIcon className="text-green-500"/> : 
                                 (item.id === SECTION_IDS.OVERVIEW ? <BookOpenIcon /> : <ChevronRightIcon />)}
                            </span>
                            <span className={`flex-1 truncate ${isCompleted && !isActive ? completedClasses : ''}`}>
                                {item.title}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;