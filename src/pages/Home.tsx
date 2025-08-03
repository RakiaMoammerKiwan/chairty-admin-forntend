// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchStatistics } from '@/services/statisticsService';
import StatCard from '@/components/HbaCard';
import FinancialTransparency from '@/components/home/FinancialTransparency';
import CampaignProgressChart from '@/components/home/CampaignProgressChart';

import {
  FaProjectDiagram,
  FaDonate,
  FaUsers,
  FaHandsHelping,
  FaHeart,
  FaBook,
  FaHome,
  FaUtensils,
  FaPray,
} from 'react-icons/fa';

interface Statistics {
  total_donations: number;
  accepted_volunteers: number;
  beneficiaries: number;
  donors: number;
  projects_count: number;
  health_projects_balance: number;
  educational_projects_balance: number;
  nutritional_projects_balance: number;
  housing_projects_balance: number;
  religious_projects_balance: number;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      const response = await fetchStatistics();
      setStats(response);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      setError('حدث خطأ أثناء تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // دالة لتنسيق الأرقام
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ar-SA');
  };

  // حساب إجمالي الأرصدة
  const getTotalBalance = () => {
    if (!stats) return 0;
    return (
      stats.health_projects_balance +
      stats.educational_projects_balance +
      stats.nutritional_projects_balance +
      stats.housing_projects_balance +
      stats.religious_projects_balance
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-2xl md:text-3xl bg-white p-2 rounded-lg shadow-md font-bold text-center text-[#47B981] mb-8">
        لوحة التحكم - الإحصائيات
      </h1>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47B981] mb-4"></div>
          <p className="text-gray-500">جاري تحميل البيانات...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={loadStats}
            className="mt-4 px-4 py-2 bg-[#47B981] text-white rounded-lg hover:bg-[#3da371] transition"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : stats ? (
        <>
          {/* إحصائيات عامة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              icon={<FaProjectDiagram size={24} />}
              title="حملات الجمعية"
              value={stats.projects_count}
              subtitle="مشاريع فعالة ومؤرشفة"
              color="text-blue-600"
            />
            <StatCard
              icon={<FaDonate size={24} />}
              title="إجمالي التبرعات"
              value={stats.total_donations}
              subtitle="تشمل كافة أنواع التبرعات"
              color="text-green-600"
            />
            <StatCard
              icon={<FaUsers size={24} />}
              title="العدد الكلي للمتبرعين"
              value={stats.donors}
              subtitle="إزدياد بنسبة 12% عن العام الماضي"
              color="text-purple-600"
            />
            <StatCard
              icon={<FaUsers size={24} />}
              title="العدد الكلي للمتطوعين"
              value={stats.accepted_volunteers}
              subtitle="إزدياد بنسبة 12% عن العام الماضي"
              color="text-orange-600"
            />
            <StatCard
              icon={<FaHandsHelping size={24} />}
              title="العدد الكلي للمستفيدين"
              value={stats.beneficiaries}
              subtitle="إزدياد بنسبة 9% عن العام الماضي"
              color="text-red-600"
            />
          </div>

          {/* رصيد المشاريع حسب النوع */}
          <h2 className="text-xl md:text-2xl font-bold text-center text-[#47B981] mb-6">
            أرصدة مشاريع الجمعية
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              icon={<FaHeart size={24} />}
              title="رصيد المشاريع الصحية"
              value={stats.health_projects_balance}
              subtitle="متاح للتبرع للمشاريع الصحية"
              color="text-red-600"
            />
            <StatCard
              icon={<FaBook size={24} />}
              title="رصيد المشاريع التعليمية"
              value={stats.educational_projects_balance}
              subtitle="متاح للتبرع للمشاريع التعليمية"
              color="text-blue-600"
            />
            <StatCard
              icon={<FaUtensils size={24} />}
              title="رصيد المشاريع الغذائية"
              value={stats.nutritional_projects_balance}
              subtitle="متاح للتبرع للمشاريع الغذائية"
              color="text-green-600"
            />
            <StatCard
              icon={<FaHome size={24} />}
              title="رصيد المشاريع السكنية"
              value={stats.housing_projects_balance}
              subtitle="متاح للتبرع للمشاريع السكنية"
              color="text-yellow-600"
            />
            <StatCard
              icon={<FaPray size={24} />}
              title="رصيد المشاريع الدينية"
              value={stats.religious_projects_balance}
              subtitle="متاح للتبرع للمشاريع الدينية"
              color="text-purple-600"
            />
          </div>

          {/* ملخص عام */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">ملخص عام</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">إجمالي الأرصدة المتاحة:</span>
                  <span className="font-bold text-[#47B981]">
                    {formatNumber(getTotalBalance())} $
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">نسبة التبرعات إلى الأرصدة:</span>
                  <span className="font-bold text-[#47B981]">
                    {getTotalBalance() > 0 ?
                      Math.round((stats.total_donations / getTotalBalance()) * 1000) / 10 : 0}%
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">متوسط حجم المشروع:</span>
                  <span className="font-bold text-[#47B981]">
                    {stats.projects_count > 0 ? formatNumber(Math.round(stats.total_donations / stats.projects_count)) : 0} $
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">متوسط تبرع المتبرع:</span>
                  <span className="font-bold text-[#47B981]">
                    {stats.donors > 0 ? formatNumber(Math.round(stats.total_donations / stats.donors)) : 0} $
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* الرسوم البيانية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <CampaignProgressChart />
            <FinancialTransparency />
          </div>

          {/* إحصائيات سريعة */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">إحصائيات سريعة</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">عدد المشاريع الجارية</p>
                <p className="text-2xl font-bold text-blue-600">{stats.projects_count}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">إجمالي التبرعات</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(stats.total_donations)} $</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">عدد المتطوعين</p>
                <p className="text-2xl font-bold text-orange-600">{stats.accepted_volunteers}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">عدد المستفيدين</p>
                <p className="text-2xl font-bold text-red-600">{stats.beneficiaries}</p>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* <CampaignProgressChart />
      <FinancialTransparency /> */}
    </div>
  );
};

export default Home;