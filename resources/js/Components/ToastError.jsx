import React from 'react';
import { forwardRef } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

const ToastError = forwardRef(({ message, onClose }, ref) => {
    return (
        <div
            ref={ref} // Meneruskan ref ke elemen div utama
            className="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black dark:ring-gray-700 ring-opacity-5 overflow-hidden"
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            type="button"
                            className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ToastError;