import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Helmet } from 'react-helmet';
import { Eye, EyeOff, User, Phone, Mail, Lock } from 'lucide-react';

// ✅ Import logo from assets
import bgLogo from '../../assets/Vintage Automotive Logo Design.png';

const SignupPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { error } = await signUp({
        email,
        password,
        options: {
          data: { name, phone }
        }
      });
      if (error) throw error;
      setMessage('✅ Success! Please check your email to confirm your account.');
      setTimeout(() => navigate('/login'), 4000);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - REV-ORBIT Auto Frames</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#fffaf5]">
        
        {/* ✅ Background logo center */}
        <img 
          src={bgLogo}
          alt="Background Logo"
          className="absolute inset-0 m-auto w-[700px] h-[700px] object-contain opacity-20 pointer-events-none select-none"
        />

        {/* ✅ Card */}
        <div className="relative z-10 max-w-md w-full p-8 space-y-8 
                        bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40">
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
  <img src={bgLogo} alt="REV-ORBIT Logo" className="w-36 h-36 drop-shadow-lg" />
  <h2 className="font-headline text-3xl font-bold text-gray-900">Create Account</h2>
  <p className="text-gray-600 text-sm">
    Start your journey with <span className="text-orange-600 font-semibold">REV-ORBIT</span>
  </p>
</div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 
                           focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 
                           focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 
                           focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 
                           focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg transition"
            >
              {loading ? 'Creating Account…' : 'Sign Up'}
            </Button>

            {/* Messages */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center">{message}</p>}
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-700 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-orange-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
