
import React from 'react';
import { CourseProvider, useCourse } from './hooks/useCourse';
import { useTheme } from './hooks/useTheme';
import CourseImporter from './components/CourseImporter';
import Layout from './components/Layout';

const AppContent: React.FC = () => {
    const { course } = useCourse();
    useTheme();

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen font-sans">
            {course ? <Layout /> : <CourseImporter />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <CourseProvider>
            <AppContent />
        </CourseProvider>
    );
};

export default App;