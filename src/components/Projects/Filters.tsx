// src/components/Projects/Filters.tsx
import React from 'react';

const PROJECT_TYPES = ['صحي', 'ديني', 'تعليمي', 'سكني', 'غذائي', 'ميداني', 'عن بعد'];
const STATUSES = ['جاري', 'معلق', 'منتهي', 'محذوف'];
const PRIORITIES = ['الكل', 'منخفض', 'متوسط', 'مرتفع', 'حرج'];
const DURATIONS = ['الكل', 'مؤقت', 'دائم', 'تطوعي', 'فردي'];

interface FiltersProps {
  typeFilter: string;
  statusFilter: string;
  priorityFilter: string;
  durationFilter: string;
  setTypeFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setPriorityFilter: (value: string) => void;
  setDurationFilter: (value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  typeFilter,
  statusFilter,
  priorityFilter,
  durationFilter,
  setTypeFilter,
  setStatusFilter,
  setPriorityFilter,
  setDurationFilter
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-12 px-2">
      {/* فلتر الحالة */}
      <div className="flex flex-col items-center sm:items-start min-w-[180px]">
        <label className="text-lg md:text-lg font-medium text-gray-700 mb-2 text-center sm:text-right">
          الحالة
        </label>
        <div className="flex flex-wrap justify-center gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              className={`px-2 py-1 md:px-4 md:py-2 rounded-full border text-lg md:text-lg whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#47B981] text-white border-[#47B981]'
                  : 'bg-white text-[#47B981] border-[#47B981]'
              } transition-all duration-200 hover:shadow-md`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* فلاتر منسدلة */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
        {/* نوع المشروع */}
        <div className="flex flex-col items-center min-w-[120px]">
          <label className="text-sm md:text-lg font-medium text-gray-700 mb-1 text-center sm:text-right">
            نوع المشروع
          </label>
          <select
            className="px-3 py-1 border border-[#47B981] rounded-lg bg-white text-[#47B981] text-sm md:text-lg focus:outline-none focus:ring-1 focus:ring-[#47B981] min-w-[100px]"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* الأولوية */}
        <div className="flex flex-col items-center min-w-[100px]">
          <label className="text-sm md:text-lg font-medium text-gray-700 mb-1 text-center sm:text-right">
            الأولوية
          </label>
          <select
            className="px-3 py-1 border border-[#47B981] rounded-lg bg-white text-[#47B981] text-sm md:text-lg focus:outline-none focus:ring-1 focus:ring-[#47B981] min-w-[90px]"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* المدة */}
        <div className="flex flex-col items-center min-w-[100px]">
          <label className="text-sm md:text-lg font-medium text-gray-700 mb-1 text-center sm:text-right">
            المدة
          </label>
          <select
            className="px-3 py-1 border border-[#47B981] rounded-lg bg-white text-[#47B981] text-sm md:text-lg focus:outline-none focus:ring-1 focus:ring-[#47B981] min-w-[90px]"
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
          >
            {DURATIONS.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;