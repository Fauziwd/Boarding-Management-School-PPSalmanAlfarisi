import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastComponent = ({ message }) => {
    React.useEffect(() => {
        if (message) {
            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
        }
    }, [message]);

    return <ToastContainer />;
};

export default ToastComponent;