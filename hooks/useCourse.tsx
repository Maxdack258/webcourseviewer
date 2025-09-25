
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode
} from 'react';
import { Course, Progress } from '../types';
import { LOCAL_STORAGE_KEYS, SECTION_IDS } from '../constants';

interface CourseContextType {
  course: Course | null;
  progress: Progress;
  activeSectionId: string;
  importCourse: (courseData: Course) => void;
  clearCourse: () => void;
  setActiveSectionId: (sectionId: string) => void;
  markLessonAsComplete: (lessonId: string) => void;
  saveQuizAnswer: (questionId: string, answer: string) => void;
  totalLessons: number;
  completedLessonsCount: number;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress>({ completedLessons: [], quizAnswers: {} });
  const [activeSectionId, setActiveSectionId] = useState<string>(SECTION_IDS.OVERVIEW);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCourse = localStorage.getItem(LOCAL_STORAGE_KEYS.COURSE);
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS);

      if (savedCourse) {
        setCourse(JSON.parse(savedCourse));
      }

      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);

        const sanitizedProgress: Progress = { completedLessons: [], quizAnswers: {} };

        if (Array.isArray(parsedProgress.completedLessons)) {
          sanitizedProgress.completedLessons = parsedProgress.completedLessons.filter((id: any) => typeof id === 'string');
        }

        if (parsedProgress.quizAnswers && typeof parsedProgress.quizAnswers === 'object') {
          for (const qId in parsedProgress.quizAnswers) {
            const answer = parsedProgress.quizAnswers[qId];
            // Coerce old data formats (number/boolean) to string for consistency.
            if (typeof answer === 'string' || typeof answer === 'number' || typeof answer === 'boolean') {
              sanitizedProgress.quizAnswers[qId] = String(answer);
            }
          }
        }
        setProgress(sanitizedProgress);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
      setProgress({ completedLessons: [], quizAnswers: {} });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (course) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.COURSE, JSON.stringify(course));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.COURSE);
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save data to localStorage', error);
    }
  }, [course, progress, isLoaded]);

  const importCourse = useCallback((courseData: Course) => {
    setCourse(courseData);
    setProgress({ completedLessons: [], quizAnswers: {} });
    setActiveSectionId(SECTION_IDS.OVERVIEW);
  }, []);

  const clearCourse = useCallback(() => {
    setCourse(null);
    setProgress({ completedLessons: [], quizAnswers: {} });
    localStorage.removeItem(LOCAL_STORAGE_KEYS.COURSE);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PROGRESS);
  }, []);

  const markLessonAsComplete = useCallback((lessonId: string) => {
    const id = String(lessonId);
    setProgress(prev => ({
      ...prev,
      completedLessons: [...new Set([...prev.completedLessons, id])]
    }));
  }, []);

  const saveQuizAnswer = useCallback((questionId: string, answer: string) => {
    const qid = String(questionId);

    setProgress(prev => ({
      ...prev,
      quizAnswers: {
        ...prev.quizAnswers,
        [qid]: answer,
      },
    }));
  }, []);

  const totalLessons = course?.lessons?.length ?? 0;
  const completedLessonsCount = progress.completedLessons.length;

  const value = {
    course,
    progress,
    activeSectionId,
    importCourse,
    clearCourse,
    setActiveSectionId,
    markLessonAsComplete,
    saveQuizAnswer,
    totalLessons,
    completedLessonsCount
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourse = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
