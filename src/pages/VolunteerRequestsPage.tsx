// src/pages/VolunteerRequestsPage.tsx
import React, { useEffect, useState } from 'react';
import { fetchVolunteerRequestsByStatus, approveVolunteerRequest, rejectVolunteerRequest } from '../services/volunteersService';
import { FiUser, FiPhone, FiMapPin, FiClock, FiCheck, FiX, FiInfo, FiHexagon, FiSmartphone, FiCode, FiSunset, FiActivity } from 'react-icons/fi';

// تعريف نوع المتطوع بناءً على هيكل API الفعلي
import { VolunteerRequest } from '../types/VolunteerRequest';

const VolunteerRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<VolunteerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'مقبول' | 'مرفوض' | 'معلق'>('معلق');
  const [selectedRequest, setSelectedRequest] = useState<VolunteerRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // ✅ جلب البيانات حسب الحالة
  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchVolunteerRequestsByStatus(statusFilter);
      setRequests(data);
    } catch (err) {
      setError('فشل تحميل طلبات التطوع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);


  const handleStatusChange = async (id: number, newStatus: 'مقبول' | 'مرفوض') => {
    try {
      const action = newStatus === 'مقبول' ? approveVolunteerRequest : rejectVolunteerRequest;

      await action(id); // نُرسل فقط ID الطلب

      // التحديث الأمثل (Optimistic UI)
      setRequests(prev => prev.map(req =>
        req.id === id ? { ...req, volunteer_status: newStatus } : req
      ));

      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, volunteer_status: newStatus });
      }
    } catch (err: any) {
      const message = err.response?.data?.message || `فشل ${newStatus === 'مقبول' ? 'قبول' : 'رفض'} الطلب`;
      setError(message);
    }
  };

  // ✅ حظر المتطوع
  const handleBanVolunteer = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حظر هذا المتطوع؟')) return;

    try {
      // إزالة المتطوع من القائمة
      setRequests(prev => prev.filter(req => req.id !== id));
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
        setDialogOpen(false);
      }
    } catch (err) {
      setError('فشل في حظر المتطوع');
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-2xl md:text-3xl bg-white p-2 rounded-lg shadow-md font-bold text-center text-[#47B981] mb-6 md:mb-8">
        طلبات التطوع
      </h1>

      {/* أزرار التصفية */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {(['معلق', 'مقبول', 'مرفوض'] as const).map((status) => (
          <button
            key={status}
            className={`px-3 py-1 md:px-4 md:py-2 rounded-full border text-sm md:text-base ${statusFilter === status
              ? 'bg-[#47B981] text-white border-[#47B981]'
              : 'bg-white text-[#47B981] border-[#47B981]'
              } transition-colors duration-200`}
            onClick={() => setStatusFilter(status)}
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
      ) : requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لا توجد طلبات في هذه الحالة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {request.full_name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${request.volunteer_status === 'مقبول' ? 'bg-green-100 text-green-800' :
                    request.volunteer_status === 'مرفوض' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {request.volunteer_status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <FiUser className="ml-2 text-[#47B981]" size={16} />
                    <span>العمر: <span className="font-medium">{request["age"]}</span></span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="ml-2 text-[#47B981]" size={16} />
                    <span>الهاتف: <span className="font-medium">{request.phone_number || 'غير متوفر'}</span></span>
                  </div>
                  <div className="flex items-center">
                    <FiMapPin className="ml-2 text-[#47B981]" size={16} />
                    <span>الموقع: <span className="font-medium">{request["place_of_residence"]}</span></span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="ml-2 text-[#47B981]" size={16} />
                    <span>الجنس: <span className="font-medium">{request["gender"]}</span></span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => { setSelectedRequest(request); setDialogOpen(true); }}
                    className="text-sm text-[#47B981] flex items-center gap-1 hover:text-[#3da371] transition-colors"
                  >
                    <FiInfo size={16} /> تفاصيل
                  </button>

                  {/* عرض الأزرار حسب الحالة */}
                  <div className="flex gap-2">
                    {request.volunteer_status === 'معلق' && (
                      <>
                        <button
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center hover:bg-green-200 transition"
                          onClick={() => handleStatusChange(request.id, 'مقبول')}
                        >
                          <FiCheck className="ml-1" /> قبول
                        </button>
                        <button
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center hover:bg-red-200 transition"
                          onClick={() => handleStatusChange(request.id, 'مرفوض')}
                        >
                          <FiX className="ml-1" /> رفض
                        </button>
                      </>
                    )}

                    {/* {request.volunteer_status === 'مقبول' && (
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center hover:bg-red-600 transition"
                        onClick={() => handleBanVolunteer(request.id)}
                      >
                        <FiX className="ml-1" /> حظر
                      </button>
                    )} */}
                    {/* إذا كان "مرفوض"، لا نُظهر أي زر */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نافذة التفاصيل */}
      {dialogOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-[#47B981]">تفاصيل طلب التطوع</h2>
              <button
                onClick={() => setDialogOpen(false)}
                className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">المعلومات الأساسية</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FiUser className="text-[#47B981] ml-2" size={18} />
                        <div>
                          <p className="text-xs text-gray-500">الاسم الكامل</p>
                          <p className="font-medium">{selectedRequest.full_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="text-[#47B981] ml-2" size={18} />
                        <div>
                          <p className="text-xs text-gray-500">العمر</p>
                          <p className="font-medium">{selectedRequest["age"]}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FiPhone className="text-[#47B981] ml-2" size={18} />
                        <div>
                          <p className="text-xs text-gray-500">الهاتف</p>
                          <p className="font-medium">{selectedRequest.phone_number || 'غير متوفر'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">تفاصيل التطوع</h3>
                    <div className="space-y-3">

                      <div className="flex items-start">
                        <FiHexagon className="text-[#47B981] ml-2 mt-1" size={18} />
                        <div>
                          <p className="text-xs text-gray-500">عدد ساعات التطوع </p>
                          <p className="font-medium">{selectedRequest.volunteering_hours}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FiInfo className="text-[#47B981] ml-2 mt-1" size={18} />
                        <div>
                          <p className="text-xs text-gray-500"> الغرض من التطوع</p>
                          <p className="font-medium">{selectedRequest.purpose_of_volunteering}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">التفاصيل الشخصية</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <FiMapPin className="text-[#47B981] ml-2 mt-1" size={18} />
                        <div>
                          <p className="text-xs text-gray-500">مكان السكن</p>
                          <p className="font-medium">{selectedRequest["place_of_residence"]}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiClock className="text-[#47B981] ml-2 mt-1" size={18} />
                        <div>
                          <p className="text-xs text-gray-500">الجنس</p>
                          <p className="font-medium">{selectedRequest["gender"]}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiCode className="text-[#47B981] ml-2 mt-1" size={18} />
                        <div>
                          <p className="text-xs text-gray-500">التخصص </p>
                          <p className="font-medium">{selectedRequest["your_studying_domain"]}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FiActivity className="text-[#47B981] ml-2 mt-1" size={18} />
                        <div>
                          <p className="text-xs text-gray-500">المستوى الجامعي</p>
                          <p className="font-medium">{selectedRequest.your_last_educational_qualification}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">حالة الطلب</h3>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${selectedRequest.volunteer_status === 'مقبول' ? 'bg-green-500' :
                        selectedRequest.volunteer_status === 'مرفوض' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></div>
                      <span className={`font-medium ${selectedRequest.volunteer_status === 'مقبول' ? 'text-green-600' :
                        selectedRequest.volunteer_status === 'مرفوض' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                        {selectedRequest.volunteer_status}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* أزرار الإجراءات في نافذة التفاصيل */}
              <div className="flex justify-center gap-4 pt-6 border-t">
                <button
                  onClick={() => setDialogOpen(false)}
                  className="px-6 py-2 bg-[#47B981] text-white rounded-full hover:bg-[#3da371] transition flex items-center"
                >
                  <FiX className="ml-2" />
                  إغلاق
                </button>

                {selectedRequest.volunteer_status === 'معلق' && (
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center hover:bg-green-200 transition"
                      onClick={() => {
                        handleStatusChange(selectedRequest.id, 'مقبول');
                        setDialogOpen(false);
                      }}
                    >
                      <FiCheck className="ml-1" /> قبول الطلب
                    </button>
                    <button
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center hover:bg-red-200 transition"
                      onClick={() => {
                        handleStatusChange(selectedRequest.id, 'مرفوض');
                        setDialogOpen(false);
                      }}
                    >
                      <FiX className="ml-1" /> رفض الطلب
                    </button>
                  </div>
                )}

                {/* {selectedRequest.volunteer_status === 'مقبول' && (
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium flex items-center hover:bg-red-600 transition"
                    onClick={() => {
                      handleBanVolunteer(selectedRequest.id);
                      setDialogOpen(false);
                    }}
                  >
                    <FiX className="ml-1" /> حظر المتطوع
                  </button>
                )} */}
                {/* لا شيء إذا كان "مرفوض" */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerRequestsPage;