
import React, { useState } from 'react';
import { signIn, signUp } from '../authService';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      setError('请填写邮箱和密码');
      return;
    }

    if (!isLoginView && password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLoginView) {
        // 登录
        await signIn(email, password);
        onStart(); // 登录成功后继续
      } else {
        // 注册
        await signUp(email, password, { name });
        onStart(); // 注册成功后继续
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Hero Image Section */}
      <div className="relative flex-[0.65] w-full overflow-hidden curved-bottom shadow-xl z-10 bg-gray-200">
        <img 
          alt="Close up of a human hand gently touching a puppy's paw" 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxdwNnaz8y3fbMxP3Awo9ZIr-c_eGif7sqale_djhzSwGQw3kduDNftpbXVCcSjCRVgVgKAuI-dbPOVJlIhqAYCKnf-92joB7IiMm75TMAR_LcmZGZkdOm1JnC3J07DQLUgZBT4GVIowT8b6vcq3g2lvCp2bY3ik922MJGsTsnhU4r0i7TV0WYkmPjCvvLO-UXefsZLM1UT4lhqEGP8io4c2wr3RYaWhTyaDjKW0I2ubHa2EPToLV_pU7pJIYGWQuXZ67AU5mGfcM" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 mix-blend-overlay"></div>
        <div className="absolute top-0 w-full h-12 bg-gradient-to-b from-black/30 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="flex-[0.35] w-full px-8 pt-8 pb-6 safe-area-bottom flex flex-col items-center justify-between bg-background-light dark:bg-background-dark z-0">
        <div className="text-center space-y-4">
          <h1 className="font-chinese text-4xl font-black text-gray-800 dark:text-white leading-tight">
            找寻你的<br/>
            <span className="text-primary">毛孩子</span>
          </h1>
          <p className="font-chinese text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[280px] mx-auto">
            为流浪的小生命<br/>找一个温暖的家
          </p>
        </div>

        <div className="flex space-x-2 my-4">
          <div className="w-8 h-2 bg-primary rounded-full"></div>
          <div className="w-2 h-2 bg-primary/20 rounded-full"></div>
          <div className="w-2 h-2 bg-primary/20 rounded-full"></div>
        </div>

        <div className="w-full">
          {/* 认证表单 */}
          <div className="space-y-4">
            {!isLoginView && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">姓名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white text-sm"
                  placeholder="请输入您的姓名"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white text-sm"
                placeholder="请输入邮箱地址"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white text-sm"
                placeholder="请输入密码"
              />
            </div>
            
            {!isLoginView && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">确认密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white text-sm"
                  placeholder="请再次输入密码"
                />
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm text-center py-2">
                {error}
              </div>
            )}

            <button 
              onClick={handleAuth}
              disabled={loading}
              className="group relative w-full bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all duration-300 rounded-full py-5 shadow-soft disabled:opacity-50"
            >
              <span className="flex items-center justify-center space-x-3 text-white font-chinese text-xl font-bold">
                <span>{loading ? '处理中...' : (isLoginView ? '登录' : '注册')}</span>
              </span>
            </button>

            <div className="text-center mt-3">
              <button 
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-primary hover:underline text-sm"
              >
                {isLoginView ? '没有账户？立即注册' : '已有账户？立即登录'}
              </button>
            </div>
          </div>
          
          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-600 font-chinese">
            继续即表示您同意我们的 <a className="underline hover:text-primary" href="#">服务条款</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
