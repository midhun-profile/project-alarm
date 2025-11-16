"use client";

import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../../lib/firebaseClient";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import "./globals.css";
import { useRouter } from "next/navigation";
import useAuth from "@/lib/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleTogglePassword = () => setShowPassword(!showPassword);

   const EyeOpenIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
  
 const EyeClosedIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M9.88 9.88a3 3 0 014.24 4.24M12 5c4.478 0 8.268 2.943 9.542 7a10.953 10.953 0 01-4.034 4.907M6.464 6.464A10.953 10.953 0 003.458 12c1.274 4.057 5.064 7 9.542 7"
      />
    </svg>
  );
  

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (authLoading || user) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }


  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 p-6 font-display">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-soft-light filter blur-2xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-soft-light filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-soft-light filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>

      <main className="relative z-10 flex w-full max-w-md flex-col items-center">
        <div className="w-full rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center gap-3 mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l2.965-7.024H2.25a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                />
              </svg>
              <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">
                QuantumLeap
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            {/* Email */}
            <label className="flex flex-col">
              <p className="text-white text-base font-medium leading-normal pb-2">Email</p>
              <div className="relative flex items-center">
                {/* <span className="material-symbols-outlined absolute left-4 text-gray-500">
                  mail
                </span> */}
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#4a3b54] bg-[#221b27]/80 h-14 placeholder:text-gray-500 p-[15px] pl-12 text-base font-normal transition-all"
                  required
                />
              </div>
            </label>

            {/* Password */}
            <label className="flex flex-col">
              <p className="text-white text-base font-medium leading-normal pb-2">Password</p>
              <div className="relative flex items-center">
                {/* <span className="material-symbols-outlined absolute left-4 text-gray-500">
                  lock
                </span> */}
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#4a3b54] bg-[#221b27]/80 h-14 placeholder:text-gray-500 p-[15px] pl-12 text-base font-normal transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute right-4 text-gray-500 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </span>
                </button>
              </div>
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end pt-1">
              <a href="#" className="text-sm text-primary/80 hover:text-primary hover:underline transition-colors">
                Forgot Password?
              </a>
            </div>

            {/* Login Buttons */}
            <div className="flex flex-col gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center rounded-lg px-4 py-2 text-base font-bold text-white transition-all login-button"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-base font-semibold text-white transition-all hover:bg-white/20"
              >
                <svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                    c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                    s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
                    c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4
                    C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
                    C29.211,35.091,26.715,36,24,36c-5.223,0-9.657-3.356-11.303-8H6.306
                    C9.656,39.663,16.318,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303
                    c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238
                    C42.012,35.138,44,30.023,44,24
                    C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                <span>{loading ? "Logging in..." : "Login with Google"}</span>
              </button>
            </div>

            {/* Footer */}
            <div className="pt-8 text-center text-sm text-gray-400">
              <p>
                Don't have an account?{" "}
                <a href="/signup" className="font-semibold text-primary/80 hover:text-primary hover:underline transition-colors">
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
