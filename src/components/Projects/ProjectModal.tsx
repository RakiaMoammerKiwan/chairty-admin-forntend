// src/components/Projects/ProjectModal.tsx
import React from 'react';
import { Project } from '../../types/Project';
import { FiX, FiTrash2, FiClock, FiMapPin, FiFlag, FiBarChart2, FiList } from 'react-icons/fi';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  onMarkAsCompleted: (project: Project) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onDelete,
  onMarkAsCompleted
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-[#47B981]">تفاصيل المشروع</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={`http://127.0.0.1:8000/storage/${project.photo}`}
                alt={project.name}
                className="w-full h-48 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Project+Image';
                }}
              />
            </div>
            <div className="md:w-2/3 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{project.name}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <FiClock className="text-[#47B981] ml-2" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">نوع المشروع</p>
                    <p className="font-medium">{project.duration_type}</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <FiFlag className="text-[#47B981] ml-2" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">الحالة</p>
                    <p className={`font-medium ${
                      project.status === 'جاري' ? 'text-green-600' :
                      project.status === 'معلق' ? 'text-yellow-600' :
                      project.status === 'منتهي' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {project.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <FiBarChart2 className="text-[#47B981] ml-2" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">الأولوية</p>
                    <p className={`font-medium ${
                      project.priority === 'حرج' ? 'text-red-600' :
                      project.priority === 'مرتفع' ? 'text-orange-500' :
                      project.priority === 'متوسط' ? 'text-yellow-500' : 'text-green-600'
                    }`}>
                      {project.priority}
                    </p>
                  </div>
                </div>
                {project.location && (
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <FiMapPin className="text-[#47B981] ml-2" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">الموقع</p>
                      <p className="font-medium">{project.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {(project.volunteer_hours || project.required_tasks) && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-[#47B981] mb-4">تفاصيل إضافية</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.volunteer_hours && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiClock className="text-[#47B981] ml-2" />
                      <span className="font-medium">عدد ساعات التطوع</span>
                    </div>
                    <p className="text-gray-700">{project.volunteer_hours} ساعة</p>
                  </div>
                )}
                {project.required_tasks && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiList className="text-[#47B981] ml-2" />
                      <span className="font-medium">المهام المطلوبة</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{project.required_tasks}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-center gap-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#47B981] text-white rounded-full hover:bg-[#3da371] transition flex items-center"
            >
              <FiX className="ml-2" />
              إغلاق
            </button>
            {project.duration_type === 'تطوعي' && project.status === 'جاري' && (
              <button
                onClick={() => onMarkAsCompleted(project)}
                className="px-6 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition flex items-center"
              >
                <FiCheckCircle className="ml-2" />
                إكمال المشروع
              </button>
            )}
            <button
              onClick={() => {
                onDelete(project.id);
                onClose();
              }}
              className="px-6 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition flex items-center"
            >
              <FiTrash2 className="ml-2" />
              حذف المشروع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;