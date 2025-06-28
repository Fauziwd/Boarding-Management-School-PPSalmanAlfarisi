import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    return (
        <div className="flex mt-8 space-x-2 justify-center">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url}
                    className={
                        link.active
                            ? " px-3  border border-teal-600 bg-teal-600 text-white dark:bg-gray-900 dark:border-gray-500 rounded-md"
                            : " px-3  border border-teal-600 text-primary hover:bg-teal-500 dark:text-white hover:text-white dark:hover:bg-gray-900 dark:border-gray-500 rounded-md"
                    }
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
