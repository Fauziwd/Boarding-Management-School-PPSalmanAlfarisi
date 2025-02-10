import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        
        <div className='flex mt-8 space-x-2 justify-center'>
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url}
                    className={
                        link.active
                            ? " px-4 py-2 border border-indigo-600 bg-indigo-600 text-white dark:bg-gray-900 dark:border-gray-500 rounded-md"
                            : " px-4 py-2 border border-indigo-600 text-primary hover:bg-indigo-500 hover:text-white dark:hover:bg-gray-900 dark:border-gray-500 rounded-md"
                    }
                
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
                ))}
            </div>
    );
}
