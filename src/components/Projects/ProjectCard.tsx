// src/components/Projects/ProjectCard.tsx
import React, { useState } from 'react';
import { Project } from '../../types/Project';
import { FiInfo, FiTrash2, FiMapPin, FiChevronDown, FiChevronUp, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import DonateModal from './DonateModal';

interface ProjectCardProps {
  project: Project;
  onDetails: (project: Project) => void;
  onDelete: (id: number) => void;
  onMarkAsCompleted: (project: Project) => void;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onDonate: (id: number, amount: number) => void;
  donationLoading: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onDetails,
  onDelete,
  onMarkAsCompleted,
  isExpanded,
  onToggleExpand,
  onDonate,
  donationLoading
}) => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const toggleExpand = () => {
    onToggleExpand(project.id);
  };

  // تحديد إذا كان يمكن التبرع لهذا المشروع
  const canDonate = project.status === 'جاري' && 
                   !['دائم', 'تطوعي'].includes(project.duration_type) &&
                   project.current_amount < project.total_amount;

  return (
    <>
      <div 
        key={project.id}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
      >
        <div className="relative">
          <img
            src={`http://127.0.0.1:8000/storage/${project.photo}`}
            alt={project.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Project+Image';
            }}
          />
          <div className="absolute top-2 left-2 bg-[#47B981] text-white text-xs px-2 py-1 rounded">
            {project.duration_type}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {project.name}
          </h3>
          
          {/* شريط تقدم المشروع */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{project.current_amount}$</span>
              <span>{project.total_amount}$</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#47B981] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(project.current_amount / project.total_amount) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="relative">
            <p className={`text-sm text-gray-600 mb-3 ${isExpanded ? '' : 'line-clamp-3'}`}>
              {project.description}
            </p>
            {project.description && project.description.length > 100 && (
              <button
                onClick={toggleExpand}
                className="text-[#47B981] text-xs flex items-center mt-1"
              >
                {isExpanded ? (
                  <>
                    <FiChevronUp className="ml-1" /> إظهار أقل
                  </>
                ) : (
                  <>
                    <FiChevronDown className="ml-1" /> إظهار المزيد
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`text-xs px-2 py-1 rounded-full ${
              project.status === 'جاري' ? 'bg-green-100 text-green-800' :
              project.status === 'معلق' ? 'bg-yellow-100 text-yellow-800' :
              project.status === 'منتهي' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
            }`}>
              {project.status}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              project.priority === 'حرج' ? 'bg-red-100 text-red-800' :
              project.priority === 'مرتفع' ? 'bg-orange-100 text-orange-800' :
              project.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}>
              {project.priority}
            </span>
          </div>
          
          {project.location && (
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <FiMapPin className="ml-1" size={14} />
              <span className="truncate">{project.location}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => onDetails(project)}
              className="text-sm text-[#47B981] flex items-center gap-1 hover:text-[#3da371] transition-colors"
            >
              <FiInfo size={16} /> تفاصيل
            </button>
            
            <div className="flex gap-2">
              {canDonate && (
                <button
                  onClick={() => setShowDonateModal(true)}
                  className="px-3 py-1 bg-[#47B981] text-white rounded-lg text-sm font-medium flex items-center hover:bg-[#3da371] transition"
                >
                  <FiDollarSign className="ml-1" size={16} /> تبرع
                </button>
              )}
              
              {project.duration_type === 'تطوعي' && project.status === 'جاري' && (
                <button
                  onClick={() => onMarkAsCompleted(project)}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center hover:bg-green-200 transition"
                >
                  <FiCheckCircle className="ml-1" size={16} /> إكمال
                </button>
              )}
              
              <button
                onClick={() => onDelete(project.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="حذف المشروع"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* نافذة التبرع */}
      <DonateModal
        project={project}
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        onDonate={(amount) => onDonate(project.id, amount)}
        isLoading={donationLoading}
      />
    </>
  );
};

export default ProjectCard;