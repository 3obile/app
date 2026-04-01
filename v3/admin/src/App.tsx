import React, { useState } from 'react';
import { Users, MessageSquare, Shield, Settings, LogOut, BarChart3, Bell } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
      active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ label, value, trend, icon: Icon }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
        <Icon size={24} />
      </div>
      <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
          <span className="text-xl font-bold text-white tracking-tight">Sawalef V3</span>
        </div>

        <nav className="space-y-2">
          <SidebarItem icon={BarChart3} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Users} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <SidebarItem icon={MessageSquare} label="Chats" active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} />
          <SidebarItem icon={Shield} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="pt-20">
          <SidebarItem icon={LogOut} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">System Overview</h1>
            <p className="text-slate-500">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
              <div className="text-right">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-full border border-slate-700" />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Users" value="24,512" trend={12.5} icon={Users} />
          <StatCard label="Active Sessions" value="1,204" trend={8.2} icon={Shield} />
          <StatCard label="Messages Today" value="142,509" trend={15.3} icon={MessageSquare} />
          <StatCard label="Media Shared" value="12.4 GB" trend={-2.4} icon={BarChart3} />
        </div>

        {/* Table Example */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Recent Users</h2>
            <button className="text-indigo-500 text-sm font-medium hover:text-indigo-400">View All</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-slate-800">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { name: 'Ahmed Ali', email: 'ahmed@example.com', status: 'Active', date: '2 mins ago' },
                { name: 'Sara Mohamed', email: 'sara@example.com', status: 'Inactive', date: '1 hour ago' },
                { name: 'Khaled Omar', email: 'khaled@example.com', status: 'Active', date: '5 hours ago' },
              ].map((user, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-800 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{user.date}</td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-white transition-colors">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;
