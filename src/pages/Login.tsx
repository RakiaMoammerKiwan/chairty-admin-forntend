import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      let errorMessage = 'فشل تسجيل الدخول';
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (field: 'email' | 'password') => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: 'email' | 'password') => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#47B981]/10 to-white flex items-center justify-center p-4" dir="rtl">
      <div className="flex flex-col md:flex-row-reverse bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl border border-gray-100">
        {/* Image Section */}
        <div className="md:w-1/2 bg-[#47B981]/5 flex items-center justify-center p-8">
          <img
            src="/src/assets/login_admin.png"
            alt="تسجيل الدخول"
            className="w-full h-auto max-h-96 object-contain transition-transform duration-500 hover:scale-105"
            loading="eager"
          />
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">{t("navbar.helloAdmin")}</h1>
            <p className="text-gray-600 mt-2">قم بإدخال الإيميل وكلمة المرور الخاص بك</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm text-center flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <div className={`relative flex items-center border ${isFocused.email ? 'border-[#47B981] ring-2 ring-[#47B981]/20' : 'border-gray-300'} rounded-lg transition-all duration-200`}>
                <span className="absolute right-3 text-gray-400">
                  <FiMail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                 className="w-full px-4 py-2 pl-10 pr-12 bg-transparent outline-none"
                   placeholder="أدخل بريدك الإلكتروني"
                  dir="rtl"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
              <div className={`relative flex items-center border ${isFocused.password ? 'border-[#47B981] ring-2 ring-[#47B981]/20' : 'border-gray-300'} rounded-lg transition-all duration-200`}>
                <span className="absolute right-3 text-gray-400">
                  <FiLock size={18} />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  className="w-full px-4 py-2 pl-10 pr-12 bg-transparent outline-none"
                  placeholder="أدخل كلمة المرور"
                  dir="rtl"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute left-3 text-gray-500 hover:text-[#47B981] transition-colors"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? (
                    <FiEyeOff size={20} className="text-[#47B981]" />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    password.length < 6 ? 'bg-red-500' :
                    password.length < 10 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></span>
                  قوة كلمة المرور: 
                  <span className={`mr-1 ${
                    password.length < 6 ? 'text-red-500' :
                    password.length < 10 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {password.length < 6 ? 'ضعيفة' : password.length < 10 ? 'متوسطة' : 'قوية'}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#47B981] text-white py-3 px-4 rounded-lg hover:bg-[#3da371] transition-colors focus:outline-none focus:ring-2 focus:ring-[#47B981] focus:ring-offset-2 flex items-center justify-center ${
                loading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// 47B981