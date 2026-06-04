import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import api from "../api/axios";

function Dashboard() {
  const [attendance, setAttendance] = useState([]);
  const [hours, setHours] = useState([]);
  const [weekStart, setWeekStart] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    api
      .get(`/kpi/attendance?week_start=${weekStart}`)
      .then((res) => setAttendance(res.data.attendance || []));
  }, [weekStart]);

  useEffect(() => {
    api.get("/kpi/hours").then((res) => setHours(res.data.hours || []));
  }, []);

  const prevWeek = () => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() - 7);
    setWeekStart(date.toISOString().split("T")[0]);
  };

  const nextWeek = () => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + 7);
    setWeekStart(date.toISOString().split("T")[0]);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-56 bg-zinc-900 flex flex-col gap-2 p-4 border-r border-zinc-800">
        <a href="/dashboard">
          <img src="/favicon.svg" className="w-8 mb-4" />
        </a>
        <a href="/users" className="p-3 rounded-lg hover:bg-zinc-800">
          Users
        </a>
        <a href="/shifts" className="p-3 rounded-lg hover:bg-zinc-800">
          Shifts
        </a>
        <a href="/products" className="p-3 rounded-lg hover:bg-zinc-800">
          Products
        </a>
        <a href="/invoices" className="p-3 rounded-lg hover:bg-zinc-800">
          Invoices
        </a>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <div className="bg-zinc-900 p-4 rounded-xl w-96">
          <h3 className="text-lg font-semibold mb-2">Weekly Attendance</h3>
          <div className="flex gap-2 mb-4">
            <button
              onClick={prevWeek}
              className="bg-zinc-800 px-3 py-1 rounded"
            >
              prev
            </button>
            <span className="text-zinc-400 text-sm">{weekStart}</span>
            <button
              onClick={nextWeek}
              className="bg-zinc-800 px-3 py-1 rounded"
            >
              next
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendance}>
              <XAxis dataKey="full_name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="hours_worked" fill="#7c3aed" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl w-96 mt-6">
          <h3 className="text-lg font-semibold mb-4">Staff Hours</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={hours}
                dataKey="hours_worked"
                nameKey="full_name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#2563eb"
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
