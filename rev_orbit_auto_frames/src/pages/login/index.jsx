import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ADMIN_EMAIL } from "../../utils/constants";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Mail, Key, Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.png"; // ✅ Logo import

const LoginPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;

      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        navigate("/admin");
      } else {
        navigate("/account-dashboard");
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Login - REV-ORBIT Auto Frames</title>
      </Helmet>

      {/* Background */}
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Car background image (no blur) */}
        <div
          className="absolute inset-0 bg-cover bg-center brightness-150"
          style={{ backgroundImage: "url('/images/cars-bg.jpg')" }}
        />

        {/* Extra Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#fffaf5]/90 to-white/95"></div>

        {/* ✅ Faint Logo in background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={logo}
            alt="Background Logo"
            className="w-[650px] opacity-15 select-none pointer-events-none"
          />
        </div>

        {/* Glassmorphic Card */}
        <div
          className="relative z-10 max-w-md w-full px-10 py-12 space-y-8
                     bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60"
        >
          {/* ✅ Center Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="REV-ORBIT Auto Frames Logo"
              className="w-40 h-auto drop-shadow-md"
            />
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm">
              Sign in to continue your journey with{" "}
              <span className="font-semibold text-orange-600">REV-ORBIT</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="pl-10 mt-1 w-full px-4 py-3 rounded-lg bg-white text-gray-900 
                           focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Key size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-12 py-3 w-full rounded-lg bg-white text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold 
                         shadow-lg hover:bg-orange-600 transition disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Login"}
            </button>

            {/* Error */}
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-700 mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-orange-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
