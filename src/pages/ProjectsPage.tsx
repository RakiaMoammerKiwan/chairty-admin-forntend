// src/pages/ProjectsPage.tsx
import React, { useEffect, useState } from 'react';
import { fetchProjectsByType, fetchProjectsByStatus, deleteProject, markVolunteerProjectAsCompleted, donateToProject } from '../services/projectsService';
import { Project } from '../types/Project';
import {
  FiInfo,
  FiTrash2,
  FiX,
  FiClock,
  FiMapPin,
  FiFlag,
  FiBarChart2,
  FiList,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiDollarSign
} from 'react-icons/fi';

const PROJECT_TYPES = ['صحي', 'ديني', 'تعليمي', 'سكني', 'غذائي', 'ميداني', 'عن بعد'];
const STATUSES = ['جاري', 'معلق', 'منتهي', 'محذوف'];
const PRIORITIES = ['الكل', 'منخفض', 'متوسط', 'مرتفع', 'حرج'];
const DURATIONS = ['الكل', 'مؤقت', 'دائم', 'تطوعي', 'فردي'];

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('صحي');
  const [statusFilter, setStatusFilter] = useState<string>('جاري');
  const [priorityFilter, setPriorityFilter] = useState<string>('الكل');
  const [durationFilter, setDurationFilter] = useState<string>('الكل');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [donationProject, setDonationProject] = useState<Project | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});
  const [donationLoading, setDonationLoading] = useState(false);

  // جلب المشاريع حسب النوع
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjectsByType(typeFilter);
        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        setError('فشل تحميل المشاريع');
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [typeFilter]);

  // جلب المشاريع حسب الحالة
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjectsByStatus(statusFilter);
        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        setError('فشل تحميل المشاريع');
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [statusFilter]);

  // تصفية المشاريع
  useEffect(() => {
    let filtered = [...projects];

    if (statusFilter !== 'الكل') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (priorityFilter !== 'الكل') {
      filtered = filtered.filter((p) => p.priority === priorityFilter);
    }
    if (durationFilter !== 'الكل') {
      filtered = filtered.filter((p) => p.duration_type === durationFilter);
    }

    setFilteredProjects(filtered);
    setPage(1);
  }, [statusFilter, priorityFilter, durationFilter, projects]);

  const paginatedProjects = filteredProjects.slice(0, page * perPage);

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setFilteredProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'فشل حذف المشروع');
    }
  };

  const handleMarkAsCompleted = async (project: Project) => {
    if (!window.confirm('هل أنت متأكد من أن المشروع قد اكتمل؟')) return;
    try {
      setLoading(true);
      await markVolunteerProjectAsCompleted(project.id);
      // تحديث الحالة في القائمة
      setProjects(prev => prev.map(p =>
        p.id === project.id ? { ...p, status: 'منتهي' } : p
      ));
      setFilteredProjects(prev => prev.map(p =>
        p.id === project.id ? { ...p, status: 'منتهي' } : p
      ));
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل في إكمال المشروع');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (amount: number) => {
    if (!donationProject) return;

    try {
      setDonationLoading(true);
      await donateToProject(donationProject.id, amount);

      // تحديث المشروع بعد التبرع
      setProjects(prev => prev.map(p => {
        if (p.id === donationProject.id) {
          const newCurrentAmount = Math.min(p.current_amount + amount, p.total_amount);
          return {
            ...p,
            current_amount: newCurrentAmount,
            status: newCurrentAmount === p.total_amount ? 'منتهي' : p.status
          };
        }
        return p;
      }));

      setFilteredProjects(prev => prev.map(p => {
        if (p.id === donationProject.id) {
          const newCurrentAmount = Math.min(p.current_amount + amount, p.total_amount);
          return {
            ...p,
            current_amount: newCurrentAmount,
            status: newCurrentAmount === p.total_amount ? 'منتهي' : p.status
          };
        }
        return p;
      }));

      alert(`تم التبرع بمبلغ ${amount}$ للمشروع بنجاح!`);
      setDonateModalOpen(false);
      setDonationProject(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل في التبرع للمشروع');
    } finally {
      setDonationLoading(false);
    }
  };

  const toggleDescription = (id: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openDonateModal = (project: Project) => {
    setDonationProject(project);
    setDonateModalOpen(true);
  };

  const closeDonateModal = () => {
    setDonateModalOpen(false);
    setDonationProject(null);
  };

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <h1 className="text-2xl md:text-3xl bg-white p-2 rounded-lg shadow-md font-bold text-center text-[#47B981] mb-6 md:mb-8">عرض المشاريع</h1>

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
                className={`px-2 py-1 md:px-4 md:py-2 rounded-full border text-lg md:text-lg whitespace-nowrap ${statusFilter === status
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47B981]"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-8">{error}</p>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">لا توجد مشاريع متاحة</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {paginatedProjects.map((project) => (
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

                      {/* شريط تقدم المشروع يظهر فقط للمشاريع من نوع "فردي" أو "مؤقت" */}
                      {(project.duration_type === 'فردي' || project.duration_type === 'مؤقت') && (
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
                      )}

                      <div className="relative">
                        <p className={`text-sm text-gray-600 mb-3 ${expandedDescriptions[project.id] ? '' : 'line-clamp-3'}`}>
                          {project.description}
                        </p>
                        {project.description && project.description.length > 100 && (
                          <button
                            onClick={() => toggleDescription(project.id)}
                            className="text-[#47B981] text-xs flex items-center mt-1"
                          >
                            {expandedDescriptions[project.id] ? (
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
                        <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'جاري' ? 'bg-green-100 text-green-800' :
                            project.status === 'معلق' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'منتهي' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {project.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${project.priority === 'حرج' ? 'bg-red-100 text-red-800' :
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

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => { setSelectedProject(project); setDialogOpen(true); }}
                          className="text-sm text-[#47B981] flex items-center gap-1 hover:text-[#3da371] transition-colors"
                        >
                          <FiInfo size={16} /> تفاصيل
                        </button>
                        <div className="flex gap-2">
                          {/* زر التبرع يظهر فقط للمشاريع من نوع "فردي" أو "مؤقت" */}
                          {(project.duration_type === 'فردي' || project.duration_type === 'مؤقت') &&
                            project.status === 'جاري' &&
                            project.current_amount < project.total_amount && (
                              <button
                                onClick={() => openDonateModal(project)}
                                className="px-3 py-1 bg-[#47B981] text-white rounded-lg text-sm font-medium flex items-center hover:bg-[#3da371] transition"
                              >
                                <FiDollarSign className="ml-1" size={16} /> تبرع
                              </button>
                            )}

                          {project.duration_type === 'تطوعي' && project.status === 'جاري' && (
                            <button
                              onClick={() => handleMarkAsCompleted(project)}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center hover:bg-green-200 transition"
                            >
                              <FiCheckCircle className="ml-1" size={16} /> إكمال
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="حذف المشروع"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {paginatedProjects.length < filteredProjects.length && (
                <div className="mt-8 flex justify-center">
                  <button
                    className="px-6 py-2 bg-[#47B981] text-white rounded-full hover:bg-[#3da371] transition-colors flex items-center"
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    تحميل المزيد
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* نافذة التفاصيل */}
      {dialogOpen && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-[#47B981]">تفاصيل المشروع</h2>
              <button
                onClick={() => setDialogOpen(false)}
                className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={`http://127.0.0.1:8000/storage/${selectedProject.photo}`}
                    alt={selectedProject.name}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Project+Image';
                    }}
                  />
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{selectedProject.name}</h3>
                    <p className="text-gray-600">{selectedProject.description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <FiClock className="text-[#47B981] ml-2" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">نوع المشروع</p>
                        <p className="font-medium">{selectedProject.duration_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <FiFlag className="text-[#47B981] ml-2" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">الحالة</p>
                        <p className={`font-medium ${selectedProject.status === 'جاري' ? 'text-green-600' :
                            selectedProject.status === 'معلق' ? 'text-yellow-600' :
                              selectedProject.status === 'منتهي' ? 'text-blue-600' : 'text-red-600'
                          }`}>
                          {selectedProject.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <FiBarChart2 className="text-[#47B981] ml-2" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">الأولوية</p>
                        <p className={`font-medium ${selectedProject.priority === 'حرج' ? 'text-red-600' :
                            selectedProject.priority === 'مرتفع' ? 'text-orange-500' :
                              selectedProject.priority === 'متوسط' ? 'text-yellow-500' : 'text-green-600'
                          }`}>
                          {selectedProject.priority}
                        </p>
                      </div>
                    </div>
                    {selectedProject.location && (
                      <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <FiMapPin className="text-[#47B981] ml-2" size={20} />
                        <div>
                          <p className="text-xs text-gray-500">الموقع</p>
                          <p className="font-medium">{selectedProject.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {(selectedProject.volunteer_hours || selectedProject.required_tasks) && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-[#47B981] mb-4">تفاصيل إضافية</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.volunteer_hours && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FiClock className="text-[#47B981] ml-2" />
                          <span className="font-medium">عدد ساعات التطوع</span>
                        </div>
                        <p className="text-gray-700">{selectedProject.volunteer_hours} ساعة</p>
                      </div>
                    )}
                    {selectedProject.required_tasks && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FiList className="text-[#47B981] ml-2" />
                          <span className="font-medium">المهام المطلوبة</span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line">{selectedProject.required_tasks}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-center gap-4 pt-6 border-t">
                <button
                  onClick={() => setDialogOpen(false)}
                  className="px-6 py-2 bg-[#47B981] text-white rounded-full hover:bg-[#3da371] transition flex items-center"
                >
                  <FiX className="ml-2" />
                  إغلاق
                </button>
                {/* زر التبرع في نافذة التفاصيل */}
                {(selectedProject.duration_type === 'فردي' || selectedProject.duration_type === 'مؤقت') &&
                  selectedProject.status === 'جاري' &&
                  selectedProject.current_amount < selectedProject.total_amount && (
                    <button
                      onClick={() => openDonateModal(selectedProject)}
                      className="px-6 py-2 bg-[#47B981] text-white rounded-full hover:bg-[#3da371] transition flex items-center"
                    >
                      <FiDollarSign className="ml-2" />
                      تبرع للمشروع
                    </button>
                  )}
                {selectedProject.duration_type === 'تطوعي' && selectedProject.status === 'جاري' && (
                  <button
                    onClick={() => handleMarkAsCompleted(selectedProject)}
                    className="px-6 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition flex items-center"
                  >
                    <FiCheckCircle className="ml-2" />
                    إكمال المشروع
                  </button>
                )}
                <button
                  onClick={() => {
                    if (selectedProject) {
                      handleDelete(selectedProject.id);
                      setDialogOpen(false);
                    }
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
      )}

      {/* نافذة التبرع */}
      {/* نافذة التبرع */}
      {donateModalOpen && donationProject && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-[#47B981]">تبرع لمشروع {donationProject.name}</h2>
              <button
                onClick={closeDonateModal}
                className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>المبلغ المطلوب:</span>
                    <span>{donationProject.total_amount}$</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>المبلغ المتوفر:</span>
                    <span>{donationProject.current_amount}$</span>
                  </div>
                  <div className="flex justify-between font-medium mt-2">
                    <span>المتبقي:</span>
                    <span className="text-[#47B981]">
                      {donationProject.total_amount - donationProject.current_amount}$
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  اختر المبلغ الذي ترغب في التبرع به:
                </p>

                <div className="flex gap-2 mb-4">
                  {[50, 100, 200, 500].map(amount => (
                    <button
                      key={amount}
                      onClick={() => {
                        // لا تقوم بالتبرع فورًا، فقط املأ حقل الإدخال
                        const input = document.querySelector('input[name="amount"]') as HTMLInputElement;
                        if (input) {
                          input.value = amount.toString();
                        }
                      }}
                      disabled={donationLoading}
                      className="px-3 py-2 bg-[#47B981]/10 text-[#47B981] rounded-lg text-sm font-medium hover:bg-[#47B981]/20 transition disabled:opacity-50"
                    >
                      {amount}$
                    </button>
                  ))}
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!donationProject) return;

                  const amountInput = (e.target as any).amount;
                  const amount = parseFloat(amountInput.value);

                  // التحقق من أن المبلغ لا يتجاوز المتبقي
                  const remainingAmount = donationProject.total_amount - donationProject.current_amount;
                  if (amount > remainingAmount) {
                    alert(`لا يمكن التبرع بمبلغ أكبر من المتبقي (${remainingAmount}$)`);
                    amountInput.value = remainingAmount.toString();
                    return;
                  }

                  if (amount <= 0) {
                    alert('يرجى إدخال مبلغ صحيح');
                    return;
                  }

                  handleDonate(amount);
                }}>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="amount"
                      placeholder="أدخل المبلغ"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#47B981]"
                      min="1"
                      step="1"
                      disabled={donationLoading}
                    />
                    <span className="text-gray-500">$</span>
                  </div>

                  <button
                    type="submit"
                    disabled={donationLoading}
                    className="w-full mt-4 px-6 py-2 bg-[#47B981] text-white rounded-lg hover:bg-[#3da371] transition disabled:opacity-70"
                  >
                    {donationLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        جاري التبرع...
                      </div>
                    ) : (
                      'تبرع الآن'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;