import React from 'react';
import Modal from './Modal';

const LimitExceededAlert = ({ show, onClose, onEditLimit, currentSpending, limit, newAmount }) => {
  return (
    <Modal show={show} onClose={onClose} title="Spending Limit Exceeded">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            This transaction would exceed your monthly spending limit!
          </p>
          <div className="bg-red-50 dark:bg-red-900 p-3 rounded-lg text-sm">
            <p className="text-red-700 dark:text-red-300">
              Current spending: Rp {(currentSpending || 0).toLocaleString('id-ID')}
            </p>
            <p className="text-red-700 dark:text-red-300">
              Transaction amount: Rp {(newAmount || 0).toLocaleString('id-ID')}
            </p>
            <p className="text-red-700 dark:text-red-300 font-semibold">
              Monthly limit: Rp {(limit || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              onEditLimit();
              onClose();
            }}
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 text-sm"
          >
            Edit Limit
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 p-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LimitExceededAlert;