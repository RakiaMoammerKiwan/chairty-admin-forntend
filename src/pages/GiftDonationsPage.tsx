// src/pages/GiftDonationsPage.tsx
import React, { useEffect, useState } from 'react';
import { fetchFilteredGiftDonations, markGiftDonationAsDelivered } from '../services/donationsService';
import { FiUser, FiPhone, FiDollarSign } from 'react-icons/fi';
import { Donation } from '../types/Donation';

const GiftDonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deliveredFilter, setDeliveredFilter] = useState<boolean | null>(false); // افتراضيًا: غير مُسلّمة

  const loadDonations = async () => {
    try {
      setLoading(true);
      const data = await fetchFilteredGiftDonations(deliveredFilter);
      setDonations(data);
    } catch (err) {
      setError('فشل تحميل الهدايا');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, [deliveredFilter]);

  const handleMarkAsDelivered = async (id: number) => {
    try {
      // التحديث الأمثل (Optimistic UI)
      setDonations(prev => prev.map(donation => 
        donation.id === id ? { ...donation, delivered: true } : donation
      ));

      await markGiftDonationAsDelivered(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تسجيل التسليم');
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-2xl md:text-3xl bg-white p-2 rounded-lg shadow-md font-bold text-center text-[#47B981] mb-6 md:mb-8">
        الهدايا الخاصة بالمستفيدين
      </h1>

      {/* أزرار التصفية */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          key="not-delivered"
          className={`px-3 py-1 md:px-4 md:py-2 rounded-full border text-sm md:text-base ${
            deliveredFilter === false
              ? 'bg-[#47B981] text-white border-[#47B981]'
              : 'bg-white text-[#47B981] border-[#47B981]'
          } transition-colors duration-200`}
          onClick={() => setDeliveredFilter(false)}
        >
          لم يتم التسليم
        </button>
        <button
          key="delivered"
          className={`px-3 py-1 md:px-4 md:py-2 rounded-full border text-sm md:text-base ${
            deliveredFilter === true
              ? 'bg-[#47B981] text-white border-[#47B981]'
              : 'bg-white text-[#47B981] border-[#47B981]'
          } transition-colors duration-200`}
          onClick={() => setDeliveredFilter(true)}
        >
          تم التسليم
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47B981]"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-8">{error}</p>
      ) : donations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {deliveredFilter ? 'لا توجد هدايا تم تسليمها' : 'لا توجد هدايا بانتظار التسليم'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {donation.recipient_name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    donation.delivered
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {donation.delivered ? 'تم التسليم' : 'بانتظار التسليم'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <FiPhone className="ml-2 text-[#47B981]" size={16} />
                    <span>رقم المتبرع: <span className="font-medium">{donation.recipient_number}</span></span>
                  </div>
                  <div className="flex items-center">
                    <FiDollarSign className="ml-2 text-[#47B981]" size={16} />
                    <span>المبلغ: <span className="font-medium">${donation.amount}</span></span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className="ml-2 text-[#47B981]" size={16} />
                    <span>اسم المتبرع: <span className="font-medium">{donation.full_name}</span></span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    {!donation.delivered && (
                      <button
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center hover:bg-green-200 transition"
                        onClick={() => handleMarkAsDelivered(donation.id)}
                      >
                        تم التسليم
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GiftDonationsPage;