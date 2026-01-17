// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupEmail, loginEmail, continueWithGoogle, resendVerificationEmail } from '../authService';

const AuthPage = () => {
  const [userType, setUserType] = useState('candidate');
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginMode) {
        // --- LOGIN MODE ---
        const { role } = await loginEmail(email, password);
        navigate(role === 'employer' ? '/employer-dashboard' : '/candidate-dashboard');
      } else {
        // --- SIGNUP MODE ---
        await signupEmail(email, password, userType, name);
        alert("Account created! Please check your email for the verification link.");
        setIsLoginMode(true); // Switch to login view
      }
    } catch (error) {
      // --- HANDLE VERIFICATION ERROR ---
      if (error.message.includes("Email not verified")) {
        const wantResend = window.confirm("Your email is not verified yet.Check your spam folder. Would you like to resend the verification link?");
        if (wantResend) {
          try {
            await resendVerificationEmail(email, password);
            alert("Link resent! Check your inbox (and spam folder).");
          } catch (resendError) {
            alert("Error resending email: " + resendError.message);
          }
        }
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const { role } = await continueWithGoogle(userType);
      navigate(role === 'employer' ? '/employer-dashboard' : '/candidate-dashboard');
    } catch (error) {
      console.error(error);
      alert("Google Sign In failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-indigo-100">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-xl shadow-indigo-200">
            W
          </div>
          <h2 className="text-3xl font-black text-slate-900">
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
          <button 
            type="button"
            onClick={() => setUserType('candidate')} 
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${userType === 'candidate' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Candidate
          </button>
          <button 
            type="button"
            onClick={() => setUserType('employer')} 
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${userType === 'employer' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Employer
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLoginMode && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium transition-all" 
              onChange={(e) => setName(e.target.value)}
              required 
            />
          )}

          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium transition-all" 
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium transition-all" 
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <button 
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 mt-4 disabled:opacity-70"
          >
            {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Join Wevolve')}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
            <span className="px-4 bg-white text-slate-400">Or Continue With</span>
          </div>
        </div>

        {/* Google Button */}
        <button 
          type="button"
          onClick={handleGoogle}
          className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
          <span>Google</span>
        </button>

        {/* Mode Toggle */}
        <div className="mt-10 text-center">
          <button 
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)} 
            className="text-sm text-slate-400 font-medium hover:text-indigo-600 transition-colors"
          >
            {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;