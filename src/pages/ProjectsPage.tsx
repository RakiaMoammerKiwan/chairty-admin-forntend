// src/pages/ProjectsPage.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  fetchProjectsByFilters,
  deleteProject,
  markVolunteerProjectAsCompleted,
  changeProjectStatus,
  donateToProject,
  getProjectTypes,
  getDurationTypes,
  getPriorities,
  getStatuses,
} from '../services/projectsService';
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
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiDollarSign,
  FiPercent,
  FiUser,
  FiCalendar,
  FiEdit2,
  FiPause,
  FiPlay,
} from 'react-icons/fi';
import { get } from 'http';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('الكل');
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

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const filters = {
          type: typeFilter,
          status: statusFilter,
          priority: priorityFilter,
          duration_type: durationFilter,
        };
        const data = await fetchProjectsByFilters(filters);
        setProjects(data);
        setPage(1);
      } catch (err) {
        setError('فشل تحميل المشاريع');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [typeFilter, statusFilter, priorityFilter, durationFilter]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesStatus = statusFilter === 'الكل' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'الكل' || project.priority === priorityFilter;
      const matchesDuration = durationFilter === 'الكل' || project.duration_type === durationFilter;
      return matchesStatus && matchesPriority && matchesDuration;
    });
  }, [projects, statusFilter, priorityFilter, durationFilter]);

  const refreshProjects = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        type: typeFilter,
        status: statusFilter,
        priority: priorityFilter,
        duration_type: durationFilter,
      };
      const data = await fetchProjectsByFilters(filters);
      setProjects(data);
    } catch (err) {
      setError('فشل تحميل المشاريع');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, priorityFilter, durationFilter]);

  const getCompletionPercentage = useCallback((project: Project) => {
    if (project.duration_type === 'تطوعي') {
      return 100;
    }
    if (project.total_amount === 0) return 0;
    return Math.round((project.current_amount / project.total_amount) * 100);
  }, []);

  const getProgressColor = useCallback((percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    try {
      await deleteProject(id);
      await refreshProjects();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'فشل حذف المشروع');
    }
  };

  const handleMarkAsCompleted = async (project: Project) => {
    if (!window.confirm('هل أنت متأكد من أن المشروع قد اكتمل؟')) return;
    try {
      setLoading(true);
      await markVolunteerProjectAsCompleted(project.id);
      await refreshProjects();
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل في إكمال المشروع');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectStatus = async (project: Project) => {
    try {
      await changeProjectStatus(project.id, project.status === 'معلق' ? 'جاري' : 'معلق');
      await refreshProjects();
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل في تغيير حالة المشروع');
    }
  }

  const handleDonate = async (amount: number) => {
    if (!donationProject) return;
    try {
      setDonationLoading(true);
      await donateToProject(donationProject.id, amount);
      await refreshProjects();
      alert(`تم التبرع بمبلغ ${amount}$ للمشروع بنجاح!`);
      closeDonateModal();
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل في التبرع للمشروع');
    } finally {
      setDonationLoading(false);
    }
  };

  const toggleDescription = useCallback((id: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const openDonateModal = useCallback((project: Project) => {
    setDonationProject(project);
    setDonateModalOpen(true);
  }, []);

  const closeDonateModal = useCallback(() => {
    setDonateModalOpen(false);
    setDonationProject(null);
  }, []);

  const paginatedProjects = useMemo(() => {
    return filteredProjects.slice(0, page * perPage);
  }, [filteredProjects, page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-2xl md:text-3xl bg-white p-4 rounded-xl shadow-lg font-bold text-center text-[#47B981] mb-8">
        عرض المشاريع
      </h1>

      <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-12 px-2">

          <div className="flex flex-col items-center sm:items-start min-w-[180px]">
            <label className="text-lg font-medium text-gray-700 mb-2 text-center">
              الحالة
            </label>
            <div className="flex flex-wrap justify-center gap-2">
              {getStatuses().map((status) => (
                <button
                  key={status}
                  className={`px-3 py-1.5 rounded-full border text-sm md:text-base whitespace-nowrap transition-all duration-200 ${statusFilter === status
                    ? 'bg-[#47B981] text-white border-[#47B981] shadow-md'
                    : 'bg-white text-[#47B981] border-[#47B981] hover:shadow-md'
                    }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* فلتر نوع المشروع */}
          <div className="flex flex-col">
            <label className="text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
              نوع المشروع
            </label>
            <select
              className="px-4 py-2 border border-[#47B981] rounded-lg bg-white text-[#47B981] text-base focus:outline-none focus:ring-2 focus:ring-[#47B981] focus:border-transparent transition-all"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {getProjectTypes().map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* فلتر الأولوية */}
          <div className="flex flex-col">
            <label className="text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
              الأولوية
            </label>
            <select
              className="px-4 py-2 border border-[#47B981] rounded-lg bg-white text-[#47B981] text-base focus:outline-none focus:ring-2 focus:ring-[#47B981] focus:border-transparent transition-all"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              {getPriorities().map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          {/* فلتر المدة */}
          <div className="flex flex-col">
            <label className="text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
              المدة
            </label>
            <select
              className="px-4 py-2 border border-[#47B981] rounded-lg bg-white text-[#47B981] text-base focus:outline-none focus:ring-2 focus:ring-[#47B981] focus:border-transparent transition-all"
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
            >
              {getDurationTypes().map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* حالة التحميل أو الخطأ */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#47B981]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-xl">لا توجد مشاريع متاحة حسب الفلاتر المحددة</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedProjects.map((project) => {
                  const completionPercentage = getCompletionPercentage(project);

                  return (
                    <div
                      key={project.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
                        <div className="absolute top-3 left-3 bg-[#47B981] text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md">
                          {project.duration_type}
                        </div>

                        {/* شريط تقدم مع النسبة المئوية */}
                        {(project.duration_type === 'فردي' || project.duration_type === 'مؤقت') && (
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex justify-between text-xs text-white mb-1">
                              <span>إكمال: {completionPercentage}%</span>
                              <span>{project.current_amount}$ / {project.total_amount}$</span>
                            </div>
                            <div className="w-full bg-black bg-opacity-30 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(completionPercentage)}`}
                                style={{ width: `${completionPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                          {project.name}
                        </h3>

                        <div className="relative mb-4">
                          <p
                            className={`text-sm text-gray-600 ${expandedDescriptions[project.id] ? '' : 'line-clamp-3'
                              }`}
                          >
                            {project.description}
                          </p>
                          {project.description && project.description.length > 100 && (
                            <button
                              onClick={() => toggleDescription(project.id)}
                              className="text-[#47B981] text-xs flex items-center mt-2 hover:text-[#3da371] transition-colors"
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

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span
                            className={`text-xs px-3 py-1.5 rounded-full font-medium ${project.status === 'جاري'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'معلق'
                                ? 'bg-yellow-100 text-yellow-800'
                                : project.status === 'منتهي'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {project.status}
                          </span>
                          <span
                            className={`text-xs px-3 py-1.5 rounded-full font-medium ${project.priority === 'حرج'
                              ? 'bg-red-100 text-red-800'
                              : project.priority === 'مرتفع'
                                ? 'bg-orange-100 text-orange-800'
                                : project.priority === 'متوسط'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                          >
                            {project.priority}
                          </span>
                        </div>

                        {project.location && (
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <FiMapPin className="ml-2 text-[#47B981]" size={16} />
                            <span>{project.location}</span>
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <FiCalendar className="ml-2 text-[#47B981]" size={16} />
                          <span>{formatDate(project.created_at)}</span>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setDialogOpen(true);
                            }}
                            className="text-sm text-[#47B981] flex items-center gap-1.5 hover:text-[#3da371] transition-colors font-medium"
                          >
                            <FiInfo size={18} /> التفاصيل
                          </button>

                          <div className="flex gap-2">
                            {/* زر التبرع */}
                            {(project.duration_type === 'فردي' || project.duration_type === 'مؤقت') &&
                              project.status === 'جاري' &&
                              project.current_amount < project.total_amount && (
                                <button
                                  onClick={() => openDonateModal(project)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#47B981] text-white rounded-lg text-sm font-medium hover:bg-[#3da371] transition-colors shadow-sm hover:shadow"
                                >
                                  <FiDollarSign size={16} /> تبرع
                                </button>
                              )}

                            {project.status !== 'محذوف' && project.status !== 'منتهي' && (
                              <button
                                onClick={() => handleProjectStatus(project)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-400 text-white rounded-lg text-sm font-medium hover:bg-[#3da371] transition-colors shadow-sm hover:shadow"
                              >
                                {project.status === 'جاري' && (
                                  <FiPause size={20} />
                                )}
                                {project.status === 'معلق' && (
                                  <FiPlay size={20} />
                                )}
                              </button>
                            )}

                            {/* زر إكمال المشروع التطوعي */}
                            {project.duration_type === 'تطوعي' && project.status === 'جاري' && (
                              <button
                                onClick={() => handleMarkAsCompleted(project)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#47B981] text-white rounded-lg text-sm font-medium hover:bg-[#3da371] transition-colors shadow-sm hover:shadow"
                              >
                                <FiCheckCircle size={20} />
                              </button>
                            )}

                            {/* زر حذف المشروع */}
                            {project.status !== 'محذوف' && project.status !== 'منتهي' && (
                              <button
                                onClick={() => handleDelete(project.id)}
                                className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                title="حذف المشروع"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {paginatedProjects.length < filteredProjects.length && (
                <div className="flex justify-center mb-8">
                  <button
                    className="px-8 py-3 bg-[#47B981] text-white rounded-full hover:bg-[#3da371] transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    <FiChevronDown size={18} /> تحميل المزيد
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* نافذة تفاصيل المشروع */}
      {dialogOpen && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-[#47B981]">تفاصيل المشروع</h2>
              <button
                onClick={() => setDialogOpen(false)}
                className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <img
                    src={`http://127.0.0.1:8000/storage/${selectedProject.photo}`}
                    alt={selectedProject.name}
                    className="w-full h-56 object-cover rounded-xl shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Project+Image';
                    }}
                  />
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedProject.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProject.description}</p>
                  </div>

                  {/* شريط تقدم مشروع */}
                  {(selectedProject.duration_type === 'فردي' || selectedProject.duration_type === 'مؤقت') && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <FiPercent className="text-[#47B981]" size={18} />
                          <span className="font-semibold text-gray-700">نسبة الإنجاز</span>
                        </div>
                        <span className="text-lg font-bold text-[#47B981]">
                          {getCompletionPercentage(selectedProject)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(getCompletionPercentage(selectedProject))}`}
                          style={{ width: `${getCompletionPercentage(selectedProject)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>{selectedProject.current_amount}$ تم جمعها</span>
                        <span>{selectedProject.total_amount}$ المطلوبة</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center bg-gray-50 p-4 rounded-xl">
                      <FiClock className="text-[#47B981] ml-3" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">مدة المشروع</p>
                        <p className="font-semibold">{selectedProject.duration_type}</p>
                      </div>
                    </div>

                    <div className="flex items-center bg-gray-50 p-4 rounded-xl">
                      <FiFlag className="text-[#47B981] ml-3" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">الحالة</p>
                        <p className={`font-semibold ${selectedProject.status === 'جاري' ? 'text-green-600' :
                          selectedProject.status === 'معلق' ? 'text-yellow-600' :
                            selectedProject.status === 'منتهي' ? 'text-blue-600' : 'text-red-600'
                          }`}>
                          {selectedProject.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center bg-gray-50 p-4 rounded-xl">
                      <FiBarChart2 className="text-[#47B981] ml-3" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">الأولوية</p>
                        <p className={`font-semibold ${selectedProject.priority === 'حرج' ? 'text-red-600' :
                          selectedProject.priority === 'مرتفع' ? 'text-orange-500' :
                            selectedProject.priority === 'متوسط' ? 'text-yellow-500' : 'text-green-600'
                          }`}>
                          {selectedProject.priority}
                        </p>
                      </div>
                    </div>

                    {selectedProject.location && (
                      <div className="flex items-center bg-gray-50 p-4 rounded-xl">
                        <FiMapPin className="text-[#47B981] ml-3" size={20} />
                        <div>
                          <p className="text-xs text-gray-500">الموقع</p>
                          <p className="font-semibold">{selectedProject.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {(selectedProject.volunteer_hours || selectedProject.required_tasks || selectedProject.volunteers_list?.length) && (
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

                    {/* قائمة المتطوعين (الأسماء والبريد فقط) */}
                    {selectedProject.volunteers_list && selectedProject.volunteers_list.length > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg col-span-1 md:col-span-2">
                        <div className="flex items-center mb-3">
                          <FiUser className="text-[#47B981] ml-2" />
                          <span className="font-medium text-blue-800">قائمة المتطوعين</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                          {selectedProject.volunteers_list.map((volunteer) => (
                            <li key={volunteer.id} className="p-2 bg-white rounded border border-blue-100">
                              <p className="font-semibold text-gray-800">{volunteer.name}</p>
                              <p className="text-gray-600">{volunteer.email}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4 pt-8 border-t mt-6">
                <button
                  onClick={() => setDialogOpen(false)}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium min-w-32"
                >
                  <FiX className="ml-2" /> إغلاق
                </button>

                {(selectedProject.duration_type === 'فردي' || selectedProject.duration_type === 'مؤقت') &&
                  selectedProject.status === 'جاري' &&
                  selectedProject.current_amount < selectedProject.total_amount && (
                    <button
                      onClick={() => openDonateModal(selectedProject)}
                      className="px-8 py-3 bg-[#47B981] text-white rounded-xl hover:bg-[#3da371] transition-colors flex items-center gap-2 font-medium min-w-32 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FiDollarSign className="ml-2" /> تبرع الآن
                    </button>
                  )}
                {selectedProject.status !== 'محذوف' && selectedProject.status !== 'منتهي' && selectedProject.status !== 'معلق' && (
                  <button
                    onClick={() => handleProjectStatus(selectedProject)}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium min-w-32"
                  >
                    <FiPause className='ml-2' />  تعليق المشروع

                  </button>
                )}

                {selectedProject.status !== 'محذوف' && selectedProject.status !== 'منتهي' && selectedProject.status !== 'جاري' && (

                  <button
                    onClick={() => handleProjectStatus(selectedProject)}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium min-w-32"
                  >
                    <FiPlay className='ml-2' />  استكمال المشروع

                  </button>
                )}

                {selectedProject.duration_type === 'تطوعي' && selectedProject.status === 'جاري' && (
                  <button
                    onClick={() => handleMarkAsCompleted(selectedProject)}
                    className="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2 font-medium min-w-32 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FiCheckCircle className="ml-2" /> إكمال المشروع
                  </button>
                )}

                {selectedProject.status !== 'محذوف' && selectedProject.status !== 'منتهي' && (
                  <button
                    onClick={() => {
                      if (selectedProject) {
                        handleDelete(selectedProject.id);
                        setDialogOpen(false);
                      }
                    }}
                    className="px-8 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2 font-medium min-w-32"
                  >
                    <FiTrash2 className="ml-2" /> حذف المشروع
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة التبرع */}
      {donateModalOpen && donationProject && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#47B981]">تبرع لمشروع {donationProject.name}</h2>
              <button
                onClick={closeDonateModal}
                className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 p-5 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">المبلغ المطلوب</span>
                  <span className="text-lg font-bold">{donationProject.total_amount}$</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">المبلغ المتوفر</span>
                  <span className="text-lg">{donationProject.current_amount}$</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-semibold">المتبقي</span>
                  <span className="text-2xl font-bold text-[#47B981]">
                    {donationProject.total_amount - donationProject.current_amount}$
                  </span>
                </div>

                {/* شريط تقدم التبرع */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#47B981] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(donationProject.current_amount / donationProject.total_amount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-5">
                اختر المبلغ الذي ترغب في التبرع به:
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {[50, 100, 200, 500].map(amount => {
                  const remaining = donationProject.total_amount - donationProject.current_amount;
                  const isDisabled = amount > remaining;

                  return (
                    <button
                      key={amount}
                      onClick={() => {
                        const input = document.querySelector('input[name="amount"]') as HTMLInputElement;
                        if (input) {
                          if (isDisabled) {
                            alert(`لا يمكن التبرع بمبلغ أكبر من المتبقي (${remaining}$)`);
                            input.value = remaining.toString();
                          } else {
                            input.value = amount.toString();
                          }
                        }
                      }}
                      disabled={isDisabled}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#47B981]/10 text-[#47B981] hover:bg-[#47B981]/20 hover:shadow'
                        }`}
                    >
                      {amount}$
                    </button>
                  );
                })}
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!donationProject) return;

                const amountInput = (e.target as any).amount;
                const amount = parseFloat(amountInput.value);
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
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="number"
                    name="amount"
                    placeholder="أدخل المبلغ"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#47B981] focus:border-transparent text-right text-lg"
                    min="1"
                    step="1"
                    disabled={donationLoading}
                  />
                  <span className="text-2xl font-bold text-gray-600">$</span>
                </div>

                <button
                  type="submit"
                  disabled={donationLoading}
                  className="w-full px-6 py-4 bg-[#47B981] text-white rounded-xl hover:bg-[#3da371] transition-all duration-200 flex items-center justify-center gap-2 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                >
                  {donationLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التبرع...
                    </>
                  ) : (
                    <>
                      <FiDollarSign size={20} />
                      تبرع الآن
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;