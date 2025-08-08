import React, { useState } from 'react';
import Modal from './Modal';
import CurrencyInput from './CurrencyInput';

const SpendingLimitModal = ({ show, onClose, currentLimit, onSave }) => {
  const [limit, setLimit] = useState(currentLimit || '');

  const handleSave = () => {
    const numericLimit = parseFloat(limit);
    if (numericLimit > 0) {
      onSave(numericLimit);
      onClose();
    }
  };

  const handleDelete = () => {
    onSave(null);
    setLimit('');
  };

  return (
    <Modal show={show} onClose={onClose} title="Set Monthly Spending Limit">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Monthly Spending Limit (Rupiah)
          </label>
          <CurrencyInput
            value={limit}
            onChange={setLimit}
            placeholder="Enter spending limit"
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 text-sm"
          >
            Set Limit
          </button>
          {currentLimit && (
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          )}
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

export default SpendingLimitModal;