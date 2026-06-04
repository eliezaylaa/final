import { useState } from "react";
import api from "../api/axios";

function Register() {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
   
    try {
      const res = await api.post("/auth/register", {
        full_name,
        email,
        password,
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/home";
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-96 flex flex-col gap-6 px-4">
        <div className="text-center">
          <img src="/yoan.jpeg" className="w-70 mx-auto mb-4" />
          <h1 className="text-white text-3xl font-bold">Yoyo's Club</h1>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full Name"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-lg outline-none placeholder:text-zinc-600 focus:border-violet-500"
          />
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
            onClick={handleRegister}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-lg font-semibold mt-2"
          >
            Register
          </button>
        </div>
        <p className="text-zinc-500 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-violet-400 hover:text-violet-300">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
