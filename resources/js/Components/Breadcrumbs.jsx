import { Link } from "@inertiajs/react";

export default function Breadcrumbs({ items }) {
    return (
        <nav class="flex px-5 py-3 mb-3 max-w-sm justify-center text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
  <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                {items.map((item, index) => (
                    <li key={index} className="inline-flex items-center">
                        {index > 0 && (
                            // Tanda panah ›
                            <span className="mx-5 text-gray-700 dark:text-gray-200"> <svg class="rtl:rotate-180 w-3 h-3 text-gray-700 dark:text-gray-200 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                          </svg>
                          </span>
                        )}
                        {item.href ? (
                            <Link href={item.href} className="text-gray-700 dark:text-gray-300 hover:text-gray-800">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-indigo-700 dark:text-indigo-400">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
