import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle }) => {
  return (
    <div className="bg-[#F8F9FA] rounded-sm p-4 shadow-md flex flex-col items-center text-center h-full w-full">
      {/* Icon */}
      <div className="bg-[#E5E9F2] p-3 rounded-full mb-3 text-[#6366F1]">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-gray-700 font-medium min-h-[40px]">{title}</h3>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-900 mt-2">
        {Number(value).toLocaleString()}
      </p>

      {/* Subtitle (always reserve space for one line) */}
      <p className="text-xs text-gray-500 mt-1 min-h-[16px]">
        {subtitle || '\u00A0'}
      </p>
    </div>
  );
};

export default StatCard;
