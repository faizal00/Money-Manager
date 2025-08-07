import React from 'react';

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 relative z-[10000]">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default Modal;