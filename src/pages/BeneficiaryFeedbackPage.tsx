// src/pages/BeneficiaryFeedbackPage.tsx
import React, { useEffect, useState } from 'react';
import { fetchFeedbacksByStatus, acceptFeedback, rejectFeedback } from '../services/feedbackService';
import { Feedback, FeedbackStatus } from '../types/Feedback';
import { FiUser, FiMessageSquare } from 'react-icons/fi';

const STATUSES: FeedbackStatus[] = ['معلق', 'مقبول', 'مرفوض'];

const BeneficiaryFeedbackPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus>('معلق'); // افتراضيًا: "معلق"
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await fetchFeedbacksByStatus(statusFilter);
      setFeedbacks(data);
    } catch (err) {
      setError('فشل تحميل الآراء');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, [statusFilter]);

  const handleAccept = async (id: number) => {
    try {
      await acceptFeedback(id);
      // إعادة تحميل التبويب تلقائيًا
      loadFeedbacks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل قبول الرأي');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectFeedback(id);
      // إعادة تحميل التبويب تلقائيًا
      loadFeedbacks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل رفض الرأي');
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black" dir="rtl">
      <h1 className="text-3xl bg-white p-2 rounded-lg shadow-md font-bold text-center text-[#47B981] mb-6">
        عرض آراء المستفيدين
      </h1>

      {/* فلتر الحالة */}
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {STATUSES.map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full border text-sm md:text-base ${
              statusFilter === status
                ? 'bg-[#47B981] text-white'
                : 'bg-white text-[#47B981]'
            } transition-colors duration-200`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47B981]"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-8">{error}</p>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لا توجد آراء في هذه الحالة</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-gray-50 text-black rounded-xl p-4 shadow">
              <div className="flex justify-between border-b pb-2 items-center mb-2">
                <h3 className="text-lg font-semibold text-[#47B981]">{feedback.user_name}</h3>
                <FiUser size={20} className="text-[#47B981]" />
              </div>
              <div className="text-sm text-gray-800 mb-4">
                <FiMessageSquare className="inline-block ml-2 text-[#47B981]" />
                <span className="whitespace-pre-line">{feedback.message}</span>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                {new Date(feedback.created_at).toLocaleDateString('ar-EG')}
              </div>

              {/* إظهار الأزرار فقط في تبويب "معلق" */}
              {statusFilter === 'معلق' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(feedback.id)}
                    className="bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded hover:bg-orange-200 transition"
                  >
                    رفض
                  </button>
                  <button
                    onClick={() => handleAccept(feedback.id)}
                    className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded hover:bg-green-200 transition"
                  >
                    قبول
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BeneficiaryFeedbackPage;