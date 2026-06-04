import { useState } from "react";
import api from "../api/axios";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      if (!res.data.access) {
        setError("Invalid credentials");
        return;
      }
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role == "admin") {
        window.location.href = "/dashboard";
      } else if (role == "manager" || role == "employee") {
        window.location.href = "/home";
      } else {
        window.location.href = "/shop";
      }
    } catch (err) {
      setError(err.response.data.error);
    }
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-96 flex flex-col gap-6 px-4">
        <div className="text-center">
          <img src="/favicon.svg" className="w-30 mx-auto mb-4" />
          <h1 className="text-white text-3xl font-bold">Yoyo's Club</h1>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-lg outline-none placeholder:text-zinc-600 focus:border-violet-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-lg outline-none placeholder:text-zinc-600 focus:border-violet-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-lg font-semibold mt-2"
          >
            Login
          </button>
        </div>
        <p className="text-zinc-500 text-sm text-center">
          No account?{" "}
          <a href="/register" className="text-violet-400 hover:text-violet-300">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
