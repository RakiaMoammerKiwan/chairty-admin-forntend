import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { fetchBeneficiariesPerYear } from '@/services/statisticsService';

interface BeneficiariesData {
  year: string;
  beneficiaries: number;
}

const beneficiariesChartData: React.FC = () => {
  const [data, setData] = useState<BeneficiariesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب البيانات من API عند تحميل المكون
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchBeneficiariesPerYear();
        setData(result);
      } catch (err: any) {
        console.error('Error fetching beneficiaries data:', err);
        setError('فشل تحميل بيانات المستفيدين');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // دالة لحساب إجمالي المستفيدين
  const getTotalBeneficiaries = () => {
    return data.reduce((sum, item) => sum + item.beneficiaries, 0);
  };

  // دالة لتحديد لون العمود بناءً على القيمة
  const getBarColor = (value: number) => {
    if (value >= 3) return '#10B981'; // أخضر داكن (أداء جيد)
    if (value >= 2) return '#065F46'; // أخضر متوسط
    return '#166534'; // أخضر فاتح
  };

  // دالة لتنسيق تلميح الأداة (Tooltip)
  const formatTooltip = (value: number) => {
    return [`${value} مستفيد`, ''];
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">مخطط سير الحملة</h2>
          <p className="text-sm text-gray-500 mt-1">عدد المستفيدين حسب السنوات</p>
        </div>
        
        {/* عرض الإحصائيات العامة */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-gray-50 px-3 py-2 rounded-lg">
            <span className="text-gray-600">إجمالي المستفيدين: </span>
            <span className="font-semibold text-[#47B981]">
              {getTotalBeneficiaries()}
            </span>
          </div>
          <div className="bg-gray-50 px-3 py-2 rounded-lg">
            <span className="text-gray-600">عدد السنوات: </span>
            <span className="font-semibold text-[#47B981]">
              {data.length}
            </span>
          </div>
        </div>
      </div>

      {/* حالة التحميل */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#47B981]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
          <p>{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لا توجد بيانات متاحة</p>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                tick={{ fill: '#475569', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fill: '#475569', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                formatter={formatTooltip}
                cursor={{ fill: 'rgba(71, 185, 129, 0.1)' }}
              />
              <Bar 
                dataKey="beneficiaries" 
                fill="#47B981"
                radius={[8, 8, 0, 0]}
                barSize={60}
              >
                <LabelList 
                  dataKey="beneficiaries" 
                  position="top" 
                  fill="#475569" 
                  fontSize={14} 
                  fontWeight="bold" 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* تفاصيل الأداء */}
      {!loading && !error && data.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">تحليل الأداء</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">أفضل أداء: </span>
              <span className="font-medium">
                {data.length > 0 ? 
                  `${Math.max(...data.map(d => d.beneficiaries))} مستفيد في ${data.find(d => d.beneficiaries === Math.max(...data.map(d => d.beneficiaries)))?.year}` 
                  : '-'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">متوسط السنوي: </span>
              <span className="font-medium">
                {data.length > 0 ? Math.round(getTotalBeneficiaries() / data.length) : 0} مستفيد
              </span>
            </div>
            <div>
              <span className="text-gray-600">الاتجاه: </span>
              <span className={`font-medium ${data.length >= 2 && data[data.length-1].beneficiaries > data[0].beneficiaries ? 'text-green-600' : 'text-yellow-600'}`}>
                {data.length >= 2 && data[data.length-1].beneficiaries > data[0].beneficiaries ? 'متصاعد' : 'مستقر'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default beneficiariesChartData;