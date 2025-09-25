import React from 'react';
import { useCourse } from '../hooks/useCourse';
import { useTheme } from '../hooks/useTheme';
import { MoonIcon, SunIcon } from './icons/ThemeIcons';
import { XIcon } from './icons/XIcon';

const Header: React.FC = () => {
    const { course, clearCourse, totalLessons, completedLessonsCount } = useCourse();
    const [theme, toggleTheme] = useTheme();

    const progressPercentage = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

    return (
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white truncate">{course?.title}</h1>
            <div className="flex-1 mx-8 hidden sm:block">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div
                        className="bg-teal-500 dark:bg-teal-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <p className="text-xs text-center mt-1 text-slate-500 dark:text-slate-400">{Math.round(progressPercentage)}% Complete</p>
            </div>
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-800"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
                <button
                    onClick={clearCourse}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800"
                    aria-label="Clear course and import another"
                    title="Clear course and import another"
                >
                    <XIcon />
                </button>
            </div>
        </header>
    );
};

export default Header;
