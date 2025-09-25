
import React, { useState, useCallback } from 'react';
import { useCourse } from '../hooks/useCourse';
import { UploadIcon } from './icons/UploadIcon';

const CourseImporter: React.FC = () => {
    const { importCourse } = useCourse();
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = useCallback(async (file: File) => {
        if (!file) return;

        setError(null);
        const text = await file.text();
        
        try {
            let courseData;
            if (file.name.endsWith('.js')) {
                // Create a Blob from the file content and generate a URL
                const blob = new Blob([text], { type: 'application/javascript' });
                const url = URL.createObjectURL(blob);
                try {
                    // Use dynamic import() to load the file as an ES module
                    const module = await import(/* @vite-ignore */ url);
                    courseData = module.default;
                } finally {
                    // Clean up the object URL to avoid memory leaks
                    URL.revokeObjectURL(url);
                }
            } else {
                courseData = JSON.parse(text);
            }

            // Basic validation
            if (courseData && courseData.id && courseData.title && courseData.lessons) {
                importCourse(courseData);
            } else {
                throw new Error("Invalid course file structure. Missing required properties.");
            }
        } catch (err) {
            console.error("Parsing error:", err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Failed to parse the course file. Please ensure it's a valid course.js or course.json file. Error: ${errorMessage}`);
        }
    }, [importCourse]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="max-w-2xl w-full text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">Course Viewer</h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                    An interactive learning environment. Import a course file to begin.
                </p>

                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`mt-10 p-8 border-2 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-300 dark:border-slate-600'}`}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".js,.json"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <UploadIcon />
                        <p className="mt-4 font-semibold text-teal-600 dark:text-teal-400">Click to upload or drag & drop</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Supports .js or .json course files
                        </p>
                    </label>
                </div>

                {error && <p className="mt-4 text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</p>}
            </div>
        </div>
    );
};

export default CourseImporter;