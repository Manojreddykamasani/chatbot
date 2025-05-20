import { useState } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) setError(error.message);
    else router.push("/chatbot");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-white text-3xl font-bold text-center mb-6">Welcome Back</h1>

        {error && (
          <div className="bg-red-500 text-white text-sm text-center p-2 mb-4 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-white text-sm font-medium mb-1 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="text-white text-sm font-medium mb-1 block">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 py-3 rounded-lg text-white font-semibold hover:scale-105 transition-transform"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-300 mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-purple-300 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
