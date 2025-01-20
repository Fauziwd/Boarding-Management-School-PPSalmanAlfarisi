import React from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const SweetAlert = ({ title, text, icon, confirmButtonText, onConfirm }) => {
  const showAlert = () => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: confirmButtonText,
      showCancelButton: true,
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  };

  return (
    <button onClick={showAlert} className="inline-block px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition ml-2">
      Delete
    </button>
  );
};

export default SweetAlert;