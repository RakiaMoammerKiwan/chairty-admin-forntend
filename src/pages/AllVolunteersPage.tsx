// src/pages/AllVolunteersPage.tsx
import React, { useEffect, useState } from 'react';
import { fetchFilteredVolunteers, banVolunteer, unblockVolunteer } from '../services/volunteersService';
import { FiUser, FiMail, FiPhone, FiX, FiCheck } from 'react-icons/fi';
import { Volunteer } from '../types/Volunteer';

const AllVolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banFilter, setBanFilter] = useState<boolean>(false); // افتراضيًا: غير محظور

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      const data = await fetchFilteredVolunteers(banFilter);
      setVolunteers(data);
    } catch (err) {
      setError('فشل تحميل المتطوعين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, [banFilter]);

  const handleBan = async (id: number) => {
    try {
      await banVolunteer(id);
      // التحديث الأمثل (Optimistic UI)
      setVolunteers(prev => prev.filter(v => v.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل في حظر المتطوع');
    }
  };

  const handleUnblock = async (id: number) => {
    try {
      await unblockVolunteer(id);
      // التحديث الأمثل (Optimistic UI)
      setVolunteers(prev => prev.filter(v => v.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل في فك حظر المتطوع');
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-2xl md:text-3xl bg-white p-2 rounded-lg shadow-md font-bold text-center text-[#47B981] mb-6 md:mb-8">
        جميع المتطوعين
      </h1>

      {/* أزرار التصفية */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          key="not-banned"
          className={`px-3 py-1 md:px-4 md:py-2 rounded-full border text-sm md:text-base ${
            banFilter === false
              ? 'bg-[#47B981] text-white border-[#47B981]'
              : 'bg-white text-[#47B981] border-[#47B981]'
          } transition-colors duration-200`}
          onClick={() => setBanFilter(false)}
        >
          غير محظور
        </button>
        <button
          key="banned"
          className={`px-3 py-1 md:px-4 md:py-2 rounded-full border text-sm md:text-base ${
            banFilter === true
              ? 'bg-[#47B981] text-white border-[#47B981]'
              : 'bg-white text-[#47B981] border-[#47B981]'
          } transition-colors duration-200`}
          onClick={() => setBanFilter(true)}
        >
          محظور
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47B981]"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-8">{error}</p>
      ) : volunteers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {banFilter ? 'لا يوجد متطوعين محظورين' : 'لا يوجد متطوعين غير محظورين'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {volunteers.map((volunteer) => (
            <div
              key={volunteer.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {volunteer.full_name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    volunteer.ban === 1
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {volunteer.ban === 1 ? 'محظور' : 'غير محظور'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <FiMail className="ml-2 text-[#47B981]" size={16} />
                    <span>البريد: <span className="font-medium">{volunteer.email}</span></span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="ml-2 text-[#47B981]" size={16} />
                    <span>الهاتف: <span className="font-medium">{volunteer.phone_number || 'غير متوفر'}</span></span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className="ml-2 text-[#47B981]" size={16} />
                    <span>الحالة: <span className="font-medium">{volunteer.volunteer_status}</span></span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    {volunteer.ban === 1 ? (
                      <button
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center hover:bg-green-200 transition"
                        onClick={() => handleUnblock(volunteer.id)}
                      >
                        <FiCheck className="ml-1" /> فك الحظر
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center hover:bg-red-200 transition"
                        onClick={() => handleBan(volunteer.id)}
                      >
                        <FiX className="ml-1" /> حظر
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

export default AllVolunteersPage;