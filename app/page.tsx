import React from 'react';
import { Search, Plus, User, AlertCircle, CheckCircle2, MoreHorizontal, ChevronDown } from 'lucide-react';

export default function MaintenanceDashboard() {
  // Mock Data for the list view
  const requests = [
    {
      id: 1,
      subject: "Test activity",
      employee: "Mitchell Admin",
      technician: "Aka Foster",
      category: "computer",
      stage: "New Request",
      company: "My Company (San Francisco)",
      priority: "low"
    },
    {
      id: 2,
      subject: "Leaking Pipe in Factory",
      employee: "John Doe",
      technician: "Marc Demo",
      category: "plumbing",
      stage: "In Progress",
      company: "My Company (San Francisco)",
      priority: "high"
    },
    {
      id: 3,
      subject: "Conveyor Belt Motor",
      employee: "Sarah Smith",
      technician: "Aka Foster",
      category: "machinery",
      stage: "Repaired",
      company: "Chicago Branch",
      priority: "critical"
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1c20] text-gray-100 font-sans selection:bg-purple-500/30">

      {/* --- Top Navigation --- */}
      <nav className="flex items-center gap-6 px-6 py-3 border-b border-gray-800 text-sm font-medium text-gray-400">
        <div className="text-white font-bold text-lg mr-4">Maintenance</div>
        <a href="#" className="text-white hover:text-purple-400 transition-colors">Dashboard</a>
        <a href="#" className="hover:text-purple-400 transition-colors">Maintenance Calendar</a>
        <a href="#" className="hover:text-purple-400 transition-colors">Equipment</a>
        <a href="#" className="hover:text-purple-400 transition-colors">Reporting</a>
        <a href="#" className="hover:text-purple-400 transition-colors">Teams</a>
      </nav>

      <main className="p-6">

        {/* --- Action Bar --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-md font-semibold text-sm transition-colors shadow-lg shadow-white/5 flex items-center gap-2">
              <Plus size={16} /> New
            </button>
          </div>

          <div className="flex items-center gap-3 bg-[#2a2d35] px-3 py-2 rounded-md border border-gray-700 w-full max-w-md focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-full text-gray-200 placeholder-gray-500"
            />
            <ChevronDown size={14} className="text-gray-500" />
          </div>
        </div>

        {/* --- KPI Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* Card 1: Critical Equipment (Red) */}
          <div className="bg-[#1e2025] rounded-xl p-6 border-l-4 border-red-500 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertCircle size={60} className="text-red-500" />
            </div>
            <h3 className="text-red-400 font-medium mb-1">Critical Equipment</h3>
            <div className="flex flex-col gap-1 mt-4">
              <span className="text-4xl font-bold text-white">5 Units</span>
              <span className="text-sm text-red-300/80">(Health &lt; 30%)</span>
            </div>
          </div>

          {/* Card 2: Technician Load (Blue) */}
          <div className="bg-[#1e2025] rounded-xl p-6 border-l-4 border-blue-500 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <User size={60} className="text-blue-500" />
            </div>
            <h3 className="text-blue-400 font-medium mb-1">Technician Load</h3>
            <div className="flex flex-col gap-1 mt-4">
              <span className="text-4xl font-bold text-white">85% Utilized</span>
              <span className="text-sm text-blue-300/80">(Assign Carefully)</span>
            </div>
          </div>

          {/* Card 3: Open Requests (Green) */}
          <div className="bg-[#1e2025] rounded-xl p-6 border-l-4 border-green-500 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle2 size={60} className="text-green-500" />
            </div>
            <h3 className="text-green-400 font-medium mb-1">Open Requests</h3>
            <div className="flex flex-col gap-1 mt-4">
              <span className="text-4xl font-bold text-white">12 Pending</span>
              <span className="text-sm text-green-300/80">3 Overdue</span>
            </div>
          </div>

        </div>

        {/* --- List View --- */}
        <div className="bg-[#1e2025] border border-gray-800 rounded-lg overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#252830] text-gray-200 uppercase text-xs tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4 border-b border-gray-700">Subjects</th>
                <th className="px-6 py-4 border-b border-gray-700">Employee</th>
                <th className="px-6 py-4 border-b border-gray-700">Technician</th>
                <th className="px-6 py-4 border-b border-gray-700">Category</th>
                <th className="px-6 py-4 border-b border-gray-700">Stage</th>
                <th className="px-6 py-4 border-b border-gray-700">Company</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-[#2a2d35] transition-colors group cursor-pointer">
                  <td className="px-6 py-4 text-white font-medium">{req.subject}</td>
                  <td className="px-6 py-4">{req.employee}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-900/50 text-purple-200 flex items-center justify-center text-xs">
                        {req.technician.charAt(0)}
                      </div>
                      {req.technician}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md bg-gray-800 text-gray-300 text-xs border border-gray-700">
                      {req.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${req.stage === 'New Request' ? 'bg-blue-900/30 text-blue-300' :
                        req.stage === 'Repaired' ? 'bg-green-900/30 text-green-300' :
                          'bg-yellow-900/30 text-yellow-300'
                      }`}>
                      {req.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">{req.company}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State / Footer */}
          <div className="px-6 py-4 bg-[#252830] border-t border-gray-800 text-xs text-gray-500 flex justify-between">
            <span>Showing {requests.length} records</span>
            <div className="flex gap-2">
              <button className="hover:text-white">Previous</button>
              <button className="hover:text-white">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

