import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useUI from '../hooks/useUI';

const Login = () => {
  const { isAuthenticated, loading, error, setUser, setLoading, setError, clearError, setToken, login } = useAuth();
  const { showNotification } = useUI();

  const { register, handleSubmit, formState: { errors }, setError: setRHError, clearErrors, reset } = useForm({
    defaultValues: { email: '', password: '' }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();
  }, [clearError]);


  // Clear error when user starts typing
  const handleInput = () => {
    if (error) clearError();
    clearErrors();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    clearError();
    clearErrors();
    try {
      await login(data.email, data.password);
      if (rememberMe) {
        sessionStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.removeItem('rememberMe');
      }
      showNotification('Login successful!', 'success');
      reset();
    } catch (err) {
      setRHError('email', { type: 'manual', message: 'Invalid email or password' });
      setError('password', { type: 'manual', message: 'Invalid email or password' });
      showNotification('Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen font-mono flex items-center justify-center bg-gradient-to-br from-cyan-200 via-fuchsia-200 to-yellow-100 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-pink-300 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 opacity-10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 z-0" />
      {/* Glassmorphism background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-300 opacity-30 rounded-full blur-3xl z-0" />
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="backdrop-blur-2xl bg-white/50 border border-white/50 shadow-2xl rounded-3xl rounded-tr-none rounded-bl-none px-10 py-12 space-y-10 ring-1 ring-blue-200/30">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center">
              <img className='object-contain bg-transparent drop-shadow-lg rounded-xl' src="/macsoft-logo.png" alt="MacSoft RMS" />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-gray-900 drop-shadow-md">
              Welcome to <span className="text-blue-600 uppercase">MacSoft RMS</span>
            </h2>
            <p className="mt-2 text-base text-gray-700 font-medium">
              Remote Management System
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email', { required: 'Email is required' })}
                    onInput={handleInput}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-2 border border-white/40 bg-white/40 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm shadow-sm backdrop-blur-md ${errors.email ? 'border-red-400' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password', { required: 'Password is required' })}
                    onInput={handleInput}
                    className={`appearance-none relative block w-full pl-10 pr-10 py-2 border border-white/40 bg-white/40 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm shadow-sm backdrop-blur-md ${errors.password ? 'border-red-400' : ''}`}
                    placeholder="Enter your password"
                  />
                  {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-100/80 p-3 rounded-xl shadow-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-400 border-gray-300 rounded shadow-sm"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-100/60 rounded-xl shadow-sm">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
              <div className="text-sm text-blue-800 grid gap-1">
                <strong>Macsoft</strong><p> macsoft.admin@macsoft.com</p>
                <strong>Customer</strong>   <p>customer.admin@macsoft.com</p>
                <strong>Password</strong><p> password</p>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
