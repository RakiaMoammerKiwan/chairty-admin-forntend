// src/pages/RequestFormPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showBeneficiaryRequest, acceptBeneficiaryRequest, rejectBeneficiaryRequest } from '../services/beneficiariesService';
import { FiHome, FiPlus, FiUser, FiMapPin, FiPhone, FiArrowRight } from 'react-icons/fi';

interface BeneficiaryRequest {
  id: number;
  full_name: string;
  phone_number: string;
  age: number;
  gender: string;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
  type: string;
  supplies: any[];
  marital_status: string;
  number_of_kids: number;
  kids_description: string | null;
  governorate: string;
  home_address: string;
  monthly_income: number;
  current_job: string;
  monthly_income_source: string;
  number_of_needy: number;
  expected_cost: number;
  description: string;
  severity_level: string;
  document_path: string | null;
  current_housing_condition: string;
  needed_housing_help: string | null;
  status: string;
}

const RequestFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<BeneficiaryRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRequest = async () => {
      try {
        setLoading(true);
        const data = await showBeneficiaryRequest(parseInt(id!));
        setRequest(data);
      } catch (err: any) {
        setError('فشل تحميل تفاصيل الطلب');
      } finally {
        setLoading(false);
      }
    };
    loadRequest();
  }, [id]);

  const handleAccept = async () => {
    if (!window.confirm('هل أنت متأكد من قبول هذا الطلب؟')) return;
    try {
      await acceptBeneficiaryRequest(parseInt(id!));
      alert('تم قبول الطلب بنجاح');
      navigate('/beneficiaryRequests');
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل في قبول الطلب');
    }
  };

  const handleReject = async () => {
    if (!window.confirm('هل أنت متأكد من رفض هذا الطلب؟')) return;
    try {
      await rejectBeneficiaryRequest(parseInt(id!));
      alert('تم رفض الطلب بنجاح');
      navigate('/beneficiaryRequests');
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل في رفض الطلب');
    }
  };

  const goBack = () => {
    navigate('/beneficiaryRequests');
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen text-black">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47B981]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen text-black">
        <div className="text-center text-red-500 py-8">{error}</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6 bg-white min-h-screen text-black">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لم يتم العثور على الطلب</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <h1 className="text-2xl md:text-3xl bg-white p-2 rounded-lg shadow-md font-bold text-center text-[#47B981] mb-6">طلب المحتاج</h1>

      {/* <div className="flex justify-between mb-6">
        <button
          onClick={goBack}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition flex items-center"
        >
          <FiArrowRight className="ml-2" /> العودة للقائمة
        </button>
        <div className="flex gap-4">
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-[#47B981] text-white rounded-full hover:bg-[#3da371] transition flex items-center"
          >
            مقبول
          </button>
          
          <button
            onClick={handleReject}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center"
          >
            مرفوض
          </button>
        </div>
      </div> */}

      {/* معلومات شخصية */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">معلومات شخصية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
            <input
              type="text"
              value={request.full_name}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input
              type="tel"
              value={request.phone_number}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">العمر</label>
            <input
              type="number"
              value={request.age}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الجنس</label>
            <input
              type="text"
              value={request.gender}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الحالة الاجتماعية</label>
            <input
              type="text"
              value={request.marital_status}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">عدد الأولاد</label>
            <input
              type="number"
              value={request.number_of_kids}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* الوضع المالي والمعيشي */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">الوضع المالي والمعيشي</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">مصدر الدخل الرئيسي</label>
            <input
              type="text"
              value={request.current_job}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">مستوى الدخل الشهري</label>
            <input
              type="number"
              value={request.monthly_income}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">مصدر الدخل</label>
            <input
              type="text"
              value={request.monthly_income_source}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">عدد الافراد المحتاجين للمساعدة</label>
            <input
              type="number"
              value={request.number_of_needy}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">عنوان السكن الكامل</label>
            <input
              type="text"
              value={request.home_address}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المحافظة</label>
            <input
              type="text"
              value={request.governorate}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>
      </div>

   
   <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">نوع المساعدة المطلوبة والتكلفة المتوقعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">النوع</label>
            <input
              type="text"
              value={request.type}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
            <input
              type="text"
              value={request.description}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          {(request.type === 'سكني') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"> الحالة المعيشية</label>
              <input
                type="text"
                value={request.current_housing_condition}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          )}
          {(request.type === 'سكني') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"> المساعدة المطلوبة</label>
              <input
                type="text"
                value={request.needed_housing_help}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            
          )}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الكلفة المتوقعة</label>
            <input
              type="number"
              value={request.expected_cost}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
            
          </div> */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"> درجة الخطورة</label>
              <input
                type="text"
                value={request.severity_level}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
        </div>
      </div>

      {/* وصف الحالة */}
      {(request.type === 'تعليمي') || (request.type === 'غذائي') && (

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">وصف المستلزمات</h2>
          <textarea
            value={request.supplies}
            readOnly
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      )}
       {(request.type === 'تعليمي')  && (

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">وصف المستلزمات</h2>
          <textarea
            value={request.supplies}
            readOnly
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      )}
      
      {/* تفاصيل الأبناء */}
      {request.number_of_kids >0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">تفاصيل الأولاد</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وصف الأولاد</label>
              <textarea
                value={request.kids_description || 'لا يوجد'}
                readOnly
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* زر الإقرار */}
      <div className="flex justify-between gap-4 mt-8">
        <button
          onClick={goBack}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition flex items-center"
        >
          <FiArrowRight className="ml-2" /> العودة للقائمة
        </button>
        {request.status === 'معلق' && (
        <div className="flex gap-4">
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-[#47B981] text-white rounded-full hover:bg-[#3da371] transition flex items-center"
          >
            مقبول
          </button>
          
          <button
            onClick={handleReject}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center"
          >
            مرفوض
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default RequestFormPage;