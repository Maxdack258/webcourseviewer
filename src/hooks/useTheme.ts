import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '../constants';

type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, () => void] => {
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as Theme;
            return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        } catch {
            return 'light';
        }
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const lightThemeSheet = document.querySelector('link[data-theme-light]');
        const darkThemeSheet = document.querySelector('link[data-theme-dark]');

        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        
        if (lightThemeSheet) (lightThemeSheet as HTMLLinkElement).disabled = theme === 'dark';
        if (darkThemeSheet) (darkThemeSheet as HTMLLinkElement).disabled = theme === 'light';

        try {
            localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
        } catch (error) {
            console.error("Could not save theme to localStorage", error);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return [theme, toggleTheme];
};
