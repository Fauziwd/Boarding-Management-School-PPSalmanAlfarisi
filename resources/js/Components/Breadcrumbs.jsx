import React from 'react';
import { Link } from '@inertiajs/react';

const ChevronRightIcon = ({ className = '' }) => (
    <svg 
        className={`w-4 h-4 text-gray-400 mx-1 ${className}`} 
        aria-hidden="true" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 6 10"
    >
        <path 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="m1 9 4-4-4-4" 
        />
    </svg>
);

const HomeIcon = () => (
    <svg 
        className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" 
        aria-hidden="true" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        viewBox="0 0 20 20"
    >
        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
    </svg>
);

export default function Breadcrumbs({ items = [] }) {
    // Always start with home if not already present
    const breadcrumbItems = items[0]?.label === 'Home' 
        ? items 
        : [{ label: 'Home', href: '/' }, ...items];

    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                {breadcrumbItems.map((item, index) => {
                    const isLastItem = index === breadcrumbItems.length - 1;
                    const isFirstItem = index === 0;
                    
                    return (
                        <li key={index} className="inline-flex items-center">
                            {index > 0 && <ChevronRightIcon className="mt-0.5" />}
                            
                            {item.href && !isLastItem ? (
                                <Link
                                    href={item.href}
                                    className={`inline-flex items-center text-sm font-medium transition-colors duration-200
                                        ${isFirstItem 
                                            ? 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                                            : 'text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-white'}
                                    `}
                                >
                                    {isFirstItem && <HomeIcon />}
                                    {item.label}
                                </Link>
                            ) : (
                                <span 
                                    className={`text-sm font-medium 
                                        ${isLastItem 
                                            ? 'text-teal-600 dark:text-teal-400' 
                                            : 'text-gray-500 dark:text-gray-400'}
                                    `}
                                >
                                    {isFirstItem && <HomeIcon />}
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}