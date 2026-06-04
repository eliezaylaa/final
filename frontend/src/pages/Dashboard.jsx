import {} from "react";

function Dashboard() {
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
      </div>
    </div>
  );
}

export default Dashboard;
