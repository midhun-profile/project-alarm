"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import "./globals.css";
import { useRouter } from "next/navigation";
import useAuth from "@/lib/useAuth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    building: "",
    floor: "",
  });
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Email/password registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("Please fill in all required fields!");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Save all details in Firestore via API
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name: form.name,
          email: form.email,
          location: form.location,
          building: form.building,
          floor: form.floor,
        }),
      });

      alert("Account created successfully!");
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Google registration
  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name: user.displayName || "",
          email: user.email,
          location: form.location,
          building: form.building,
          floor: form.floor,
        }),
      });

      alert("Google registration successful!");
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (authLoading || user) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark overflow-hidden p-4 sm:p-6 lg:p-8 font-display"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20"></div>
      </div>

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-8 rounded-xl glass-panel md:grid-cols-2 lg:gap-0">
        {/* LEFT PANEL */}
        <form onSubmit={handleRegister} className="flex flex-col p-8 sm:p-10 lg:p-12">
          <h1 className="text-white text-[32px] font-bold leading-tight pb-3">Create Your Account</h1>
          <p className="text-gray-400 text-base mb-8">Start your journey by setting up your credentials.</p>

          <label htmlFor="name" className="flex flex-col pb-4">
            <span className="text-white pb-2">Name</span>
            <input
              id="name"
              name="name"
              onChange={handleChange}
              value={form.name}
              placeholder="Enter your user ID"
              className="form-input bg-[#221b27]/80 text-white rounded-lg h-14 border border-[#4a3b54] p-[15px]"
            />
          </label>

          <label htmlFor="email" className="flex flex-col pb-4">
            <span className="text-white pb-2">Email Address</span>
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleChange}
              value={form.email}
              placeholder="Enter your email address"
              className="form-input bg-[#221b27]/80 text-white rounded-lg h-14 border border-[#4a3b54] p-[15px]"
            />
          </label>

          <label htmlFor="password" className="flex flex-col pb-4">
            <span className="text-white pb-2">Password</span>
            <input
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              value={form.password}
              placeholder="Enter your password"
              className="form-input bg-[#221b27]/80 text-white rounded-lg h-14 border border-[#4a3b54] p-[15px]"
            />
          </label>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-[#4a3b54]" />
            <span className="px-4 text-sm text-[#ad9cba]">OR</span>
            <hr className="flex-grow border-[#4a3b54]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="flex w-full items-center justify-center gap-3 rounded-lg h-12 bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M21.99 12.23c0-.996-.085-1.773-.245-2.55H12.22v4.832h5.495c-.24 1.422-1.078 2.627-2.318 3.455l.014.092 3.041 2.351.149.012C20.698 18.523 22 15.632 22 12.227z" />
              <path fill="#34A853" d="M12.218 22c2.895 0 5.378-.962 7.102-2.521l-3.925-2.515c-.916.621-1.983 1-3.177 1-2.691 0-4.974-1.821-5.782-4.226l-.093.005-3.145 2.44-.073.148C4.853 19.673 8.247 22 12.218 22z" />
              <path fill="#FBBC05" d="M6.436 14.738a6.1 6.1 0 0 1 0-4.294l-3.311-2.48A9.89 9.89 0 0 0 2 12.59a9.89 9.89 0 0 0 1.124 4.74l3.312-2.592z" />
              <path fill="#EA4335" d="M12.218 7.218c1.627 0 3.004.553 4.11 1.591l3.063-3.063C17.588 4.099 15.107 3 12.218 3 8.247 3 4.853 5.327 3.125 8.669l3.311 2.593c.808-2.405 3.091-4.044 5.782-4.044z" />
            </svg>
            Register with Google
          </button>

          <p className="text-center text-[#ad9cba] text-sm mt-6">
            Already have an account? <a href="/login" className="text-primary hover:text-white font-semibold">Sign In</a>
          </p>
        </form>

        {/* RIGHT PANEL */}
        <div className="flex flex-col p-8 sm:p-10 lg:p-12 md:border-l border-white/10">
          <h2 className="text-white text-[32px] font-bold pb-3">Tell Us About Yourself</h2>
          <p className="text-gray-400 text-base mb-8">Personalize your experience.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["location", "building", "floor"].map((field) => (
              <div key={field} className="flex flex-col col-span-1 sm:col-span-2">
                <label htmlFor={field} className="text-white pb-2 capitalize">{field}</label>
                <input
                  id={field}
                  name={field}
                  onChange={handleChange}
                  value={(form as any)[field]}
                  placeholder={`Enter your ${field}`}
                  className="form-input bg-[#221b27]/80 text-white rounded-lg h-14 border border-[#4a3b54] p-[15px]"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            onClick={handleRegister}
            className="group mt-12 relative flex w-full items-center justify-center rounded-lg h-14 px-5 text-white text-lg font-bold  signup-button"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative z-10">Create Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
