// src/pages/BeneficiaryRequestsPage.tsx
import React, { useEffect, useState } from 'react';
import { fetchBeneficiaryRequests } from '../services/beneficiariesService';
import { BeneficiaryRequest } from '../types/BeneficiaryRequest';
import { FiUser, FiPhone, FiMapPin, FiClock, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PROJECT_TYPES = ['صحي', 'ديني', 'تعليمي', 'سكني', 'غذائي', 'ميداني', 'عن بعد'];

const BeneficiaryRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<BeneficiaryRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState<string>('صحي');
    const [statusFilter, setStatusFilter] = useState<string>('معلق');
    const navigate = useNavigate();

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await fetchBeneficiaryRequests(typeFilter, statusFilter);
            setRequests(data);
        } catch (err: any) {
            setError('فشل تحميل طلبات التبرع');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [typeFilter, statusFilter]);

    const handleViewRequest = (id: number) => {
        navigate(`/requestForm/${id}`);
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen" dir="rtl">
            <h1 className="text-2xl md:text-3xl bg-white p-2 rounded-lg shadow-md font-bold text-center text-[#47B981] mb-6 md:mb-8">طلبات التبرع</h1>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 items-center">
                {/* فلتر نوع المشروع */}
                <div className="flex flex-col items-start lg:items-center">
                    <label className="text-lg font-medium text-gray-700 mb-2 text-start lg:text-center">
                        نوع المشروع
                    </label>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-[#47B981] rounded-lg bg-white text-[#47B981] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#47B981] min-w-[140px] w-full lg:w-auto"
                    >
                        {PROJECT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* فلتر الحالة */}
                <div className="flex flex-col items-center">
                    <label className="text-lg font-medium text-gray-700 mb-2 text-center">
                        حالة الطلب
                    </label>
                    <div className="flex flex-wrap justify-center gap-2">
                        {(['معلق', 'مقبول', 'مرفوض'] as const).map((status) => (
                            <button
                                key={status}
                                className={`px-2 py-1 md:px-4 md:py-2 rounded-full border text-lg md:text-base ${statusFilter === status
                                    ? 'bg-[#47B981] text-white border-[#47B981]'
                                    : 'bg-white text-[#47B981] border-[#47B981]'
                                    } transition-colors duration-200 hover:shadow-md`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47B981]"></div>
                </div>
            ) : error ? (
                <p className="text-center text-red-500 py-8">{error}</p>
            ) : requests.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">لا توجد طلبات مطابقة للبحث</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            onClick={() => handleViewRequest(request.id)}
                        >
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {request.full_name}
                                    </h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${request.status === 'مقبول' ? 'bg-green-100 text-green-800' :
                                            request.status === 'مرفوض' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {request.status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center">
                                        <FiUser className="ml-2 text-[#47B981]" size={16} />
                                        <span>العمر: <span className="font-medium">{request.age}</span></span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiPhone className="ml-2 text-[#47B981]" size={16} />
                                        <span>الهاتف: <span className="font-medium">{request.phone_number}</span></span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiMapPin className="ml-2 text-[#47B981]" size={16} />
                                        <span>الموقع: <span className="font-medium">{request.place_of_residence}</span></span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiClock className="ml-2 text-[#47B981]" size={16} />
                                        <span>النوع: <span className="font-medium">{request.type.name}</span></span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewRequest(request.id);
                                        }}
                                        className="text-sm text-[#47B981] font-semibold bg-gray-200 py-2 px-4 rounded-lg flex items-center gap-1 hover:text-[#3da371] transition-colors"
                                    >
                                        <FiInfo size={16} /> طلب المحتاج
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BeneficiaryRequestsPage;