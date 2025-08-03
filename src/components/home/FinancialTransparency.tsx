
import React from 'react';

const financeData = [
  {
    title: 'حملة الدواء',
    description: 'عيادات صحية متنقلة في المناطق النائية',
    amount: '$50,000',
  },
  {
    title: 'البرامج التعليمية',
    description: 'تمويل لوازم المدرسة وتدريب المعلمين',
    amount: '$120,000',
  },
  {
    title: 'مشروع تنظيف المياه',
    description: 'تركيب آبار جديدة وأنظمة تنقية المياه',
    amount: '$85,000',
  },
  {
    title: 'الإغاثة الطارئة',
    description: 'مساعدات لأصحاب الكوارث الأخرى',
    amount: '$85,000',
  },
];

const FinancialTransparency: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">تقرير الشفافية المالية</h2>
          <p className="text-sm text-gray-500 mt-1">تخصيصات التمويل الأخرى للمبادرات</p>
        </div>
        <button className="flex items-center px-4 py-1.5 border border-gray-300 text-sm rounded hover:bg-gray-50">
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Export
        </button>
      </div>

      {financeData.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-start border-t py-3 text-right"
        >
          <div>
            <p className="text-sm font-bold text-gray-800">{item.title}</p>
            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
          </div>
          <div className="text-[#EB568E] font-bold">{item.amount}</div>
        </div>
      ))}
    </div>
  );
};

export default FinancialTransparency;
