// src/components/Projects/DonateModal.tsx
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface DonateModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onDonate: (amount: number) => void;
  isLoading: boolean;
}

const DonateModal: React.FC<DonateModalProps> = ({
  project,
  isOpen,
  onClose,
  onDonate,
  isLoading
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (!amount || numAmount <= 0) {
      setError('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (numAmount > project.total_amount - project.current_amount) {
      setError('لا يمكن التبرع بمبلغ أكبر من المطلوب');
      return;
    }

    setError(null);
    onDonate(numAmount);
  };

  const handleQuickDonate = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    onDonate(quickAmount);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-[#47B981]">تبرع لمشروع {project.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>المبلغ المطلوب:</span>
                <span>{project.total_amount}$</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>المبلغ المتوفر:</span>
                <span>{project.current_amount}$</span>
              </div>
              <div className="flex justify-between font-medium mt-2">
                <span>المتبقي:</span>
                <span className="text-[#47B981]">
                  {project.total_amount - project.current_amount}$
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              اختر المبلغ الذي ترغب في التبرع به:
            </p>

            <div className="flex gap-2 mb-4">
              {[10, 50, 100].map(amount => (
                <button
                  key={amount}
                  onClick={() => handleQuickDonate(amount)}
                  disabled={isLoading}
                  className="px-3 py-2 bg-[#47B981]/10 text-[#47B981] rounded-lg text-sm font-medium hover:bg-[#47B981]/20 transition disabled:opacity-50"
                >
                  {amount}$
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="أدخل المبلغ"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#47B981]"
                  min="1"
                  step="1"
                  disabled={isLoading}
                />
                <span className="text-gray-500">$</span>
              </div>
              
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 px-6 py-2 bg-[#47B981] text-white rounded-lg hover:bg-[#3da371] transition disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    جاري التبرع...
                  </div>
                ) : (
                  'تبرع الآن'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;