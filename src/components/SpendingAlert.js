import React from 'react';
import { formatRupiah } from '../utils/formatters';

const SpendingAlert = ({ show, onClose, currentSpending, limit, percentage }) => {
  if (!show) return null;

  const getAlertColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const getAlertMessage = () => {
    if (percentage >= 100) return '🚨 Spending Limit Exceeded!';
    if (percentage >= 80) return '⚠️ Approaching Spending Limit!';
    return '💡 Spending Alert';
  };

  return (
    <div className="fixed top-4 right-4 z-[10001] max-w-sm">
      <div className={`${getAlertColor()} text-white p-4 rounded-lg shadow-lg`}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-sm">{getAlertMessage()}</h4>
            <p className="text-xs mt-1">
              Spent: {formatRupiah(currentSpending)} / {formatRupiah(limit)}
            </p>
            <p className="text-xs">({percentage.toFixed(1)}% of limit)</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 ml-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpendingAlert;