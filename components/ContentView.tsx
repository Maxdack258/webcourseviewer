
import React from 'react';
import { useCourse } from '../hooks/useCourse';
import { SECTION_IDS } from '../constants';
import Overview from './content/Overview';
import LessonView from './content/LessonView';
import QuizView from './content/QuizView';
import ResourcesView from './content/ResourcesView';
import GlossaryView from './content/GlossaryView';
import NextStepsView from './content/NextStepsView';

const ContentView: React.FC = () => {
    const { course, activeSectionId } = useCourse();

    if (!course) return null;

    if (activeSectionId === SECTION_IDS.OVERVIEW) {
        return <Overview overview={course.overview} />;
    }

    if (activeSectionId === SECTION_IDS.FINAL_QUIZ) {
        return <QuizView quiz={course.finalQuiz} title="Final Quiz" />;
    }

    if (activeSectionId === SECTION_IDS.RESOURCES) {
        return <ResourcesView resources={course.resources} />;
    }

    if (activeSectionId === SECTION_IDS.GLOSSARY) {
        return <GlossaryView glossary={course.glossary} />;
    }

    if (activeSectionId === SECTION_IDS.NEXT_STEPS) {
        return <NextStepsView nextSteps={course.nextSteps} />;
    }

    const lesson = course.lessons.find(l => l.id === activeSectionId);
    if (lesson) {
        return <LessonView lesson={lesson} />;
    }

    return <div className="text-center p-8">Select a section from the sidebar to begin.</div>;
};

export default ContentView;
