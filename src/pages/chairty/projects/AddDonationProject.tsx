import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { addBeneficiaryProject } from '../../../services/BeneficiaryProjectService';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PROJECT_TYPES = ['صحي', 'تعليمي', 'سكني', 'غذائي'];
const PRIORITIES = ['منخفض', 'متوسط', 'مرتفع', 'حرج'];

const AddDonationProjectForm = () => {
  const [formData, setFormData] = useState({
    type_id: '',
    name: '',
    description: '',
    email: '',
    total_amount: '',
    current_amount: '0',
    priority: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError(null);
      }
    },
    onDropRejected: () => {
      setError('يجب أن يكون الملف من نوع: png, jpg, jpeg, gif');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من الحقول المطلوبة
    if (!formData.type_id) {
      setError('يرجى اختيار نوع المشروع');
      return;
    }
    if (!formData.name.trim()) {
      setError('يرجى إدخال اسم المشروع');
      return;
    }
    if (!formData.description.trim()) {
      setError('يرجى إدخال وصف المشروع');
      return;
    }
    if (!formData.total_amount || parseFloat(formData.total_amount) <= 0) {
      setError('يرجى إدخال المبلغ الكلي بشكل صحيح');
      return;
    }
    if (!formData.priority) {
      setError('يرجى اختيار أولوية المشروع');
      return;
    }
    if (!file) {
      setError('يجب إضافة صورة للمشروع');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await addBeneficiaryProject(formData, file);
      setSuccess('تم إضافة المشروع بنجاح!');

      // إعادة تعيين النموذج
      setFormData({
        type_id: '',
        name: '',
        description: '',
        phone_number: '',
        total_amount: '',
        current_amount: '0',
        priority: '',
      });
      setFile(null);

      // إخفاء رسالة النجاح بعد 5 ثواني
      setTimeout(() => setSuccess(null), 5000);

      setTimeout(() => {
        navigate('/projects');
      }, 2000);

    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.photo?.[0] ||
        'حدث خطأ أثناء إضافة المشروع';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFile(null);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-4xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold text-[#47B981] bg-white p-2 rounded-lg shadow-md text-center mb-4 rounded-lg py-3">
        إضافة مشروع تبرع جديد
      </h1>

      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center animate-fade-in">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* نوع المشروع */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع المشروع *</label>
            <select
              name="type_id"
              value={formData.type_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#47B981] rounded-md focus:outline-none focus:ring-1 focus:ring-[#47B981]"
              required
            >
              <option value="">اختر نوع المشروع</option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* اسم المشروع */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم المشروع *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#47B981] rounded-md focus:outline-none focus:ring-1 focus:ring-[#47B981]"
              placeholder="مثلاً: بناء مسجد"
              required
            />
          </div>

          {/* الأولوية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">أولوية المشروع *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#47B981] rounded-md focus:outline-none focus:ring-1 focus:ring-[#47B981]"
              required
            >
              <option value="">اختر الأولوية</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* وصف المشروع */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">وصف المشروع *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-[#47B981] rounded-md focus:outline-none focus:ring-1 focus:ring-[#47B981]"
            placeholder="اشرح تفاصيل المشروع..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* رقم الهاتف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الايميل</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#47B981] rounded-md focus:outline-none focus:ring-1 focus:ring-[#47B981]"
              placeholder="أدخل الايميل"
            />
            
          </div>

          {/* المبلغ الكلي */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ الكلي المطلوب *</label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#47B981] rounded-md focus:outline-none focus:ring-1 focus:ring-[#47B981]"
              placeholder="مثلاً: 10000"
              min="1"
              required
            />
          </div>

          {/* المبلغ الحالي */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ المتوفر حالياً *</label>
            <input
              type="number"
              name="current_amount"
              value={formData.current_amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#47B981] rounded-md focus:outline-none focus:ring-1 focus:ring-[#47B981]"
              min="0"
              required
            />
          </div>
        </div>


        {/* رفع الصورة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">صورة المشروع *</label>
          {file ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt="معاينة الصورة"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-[#47B981] rounded-lg p-8 text-center cursor-pointer hover:bg-[#47B981]/5 transition-colors"
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto text-[#47B981]" size={24} />
              <p className="mt-2 text-sm text-gray-600">اسحب وأسقط الصورة هنا، أو انقر للاختيار</p>
              <p className="text-xs text-gray-500 mt-1">(JPEG, JPG, PNG, GIF فقط)</p>
            </div>
          )}
        </div>

        {/* زر الإرسال */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-3 px-4 rounded-full text-white font-medium flex items-center justify-center gap-2 ${loading || !file
              ? 'bg-[#47B981]/70 cursor-not-allowed'
              : 'bg-[#47B981] hover:bg-[#3da371] transition-colors'
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الحفظ...
              </>
            ) : (
              'حفظ المشروع'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDonationProjectForm;