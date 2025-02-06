import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        const htmlElement = document.documentElement;
        if (darkMode) {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-800 dark:hover:bg-white transition"
            aria-label="Toggle Dark Mode"
        >
            {darkMode ? '☀️' : '🌙'}
        </button>
    );
}