import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { year: '2021', value: 10 },
  { year: '2022', value: 40 },
  { year: '2023', value: 75 },
  { year: '2024', value: 120 },
  { year: '2025', value: 180 },
];

const CampaignProgressChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">مخطط سير الحملة</h2>
        <p className="text-sm text-gray-500">عدد القوائم حسب السنوات</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e2e8f0" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#47B981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CampaignProgressChart;
