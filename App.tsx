
import React, { useState, useMemo } from 'react';
import KanbanBoard from './components/KanbanBoard';
import AIInsights from './components/AIInsights';
import ContactDetail from './components/ContactDetail';
import { Contact, ContactStatus } from './types';
import { MOCK_CONTACTS } from './constants';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

type Tab = 'workflow' | 'insights' | 'dashboard';

const App: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [activeTab, setActiveTab] = useState<Tab>('workflow');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Logic for "Today's Follow-up Hub"
  const followUpQueue = useMemo(() => {
    return contacts.filter(c => {
      const isOverdue = c.nextFollowUpDate && c.nextFollowUpDate <= today;
      const hasNotifyEvent = c.oneOffEvents.some(e => !e.completed && e.notifyDate <= today);
      return isOverdue || hasNotifyEvent;
    }).sort((a, b) => (a.nextFollowUpDate || '').localeCompare(b.nextFollowUpDate || ''));
  }, [contacts, today]);

  // Conversion Metrics Calculation
  const stats = useMemo(() => {
    const total = contacts.length;
    const connected = contacts.filter(c => 
      [ContactStatus.CONNECTED, ContactStatus.COFFEE_SCHEDULED, ContactStatus.NURTURING, ContactStatus.FOLLOW_UP_NEEDED].includes(c.status)
    ).length;
    const coffee = contacts.filter(c => 
      [ContactStatus.COFFEE_SCHEDULED, ContactStatus.NURTURING, ContactStatus.FOLLOW_UP_NEEDED].includes(c.status)
    ).length;

    const invitationSuccessRate = total > 0 ? Math.round((connected / total) * 100) : 0;
    const coffeeConversionRate = connected > 0 ? Math.round((coffee / connected) * 100) : 0;

    return { total, connected, coffee, invitationSuccessRate, coffeeConversionRate };
  }, [contacts]);

  const dashboardData = [
    { name: 'Week 1', connections: 2, chats: 1 },
    { name: 'Week 2', connections: 5, chats: 2 },
    { name: 'Week 3', connections: 8, chats: 4 },
    { name: 'Week 4', connections: 12, chats: 6 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar / Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <i className="fa-solid fa-network-wired text-white"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Kinetic Networker</h1>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'workflow' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <i className="fa-solid fa-columns-line mr-2"></i> Workflow
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'insights' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <i className="fa-solid fa-sparkles mr-2"></i> AI Insights
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <i className="fa-solid fa-chart-pie mr-2"></i> Dashboard
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-100">
            <i className="fa-solid fa-plus"></i> New Lead
          </button>
          <div className="w-10 h-10 bg-slate-200 rounded-full border border-slate-300"></div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto">
        
        {/* Tab Content: Workflow (Kanban) */}
        {activeTab === 'workflow' && (
          <div className="space-y-6">
            <header className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Networking Workflow</h2>
                <p className="text-slate-500 text-sm">Manage relationships through the full coffee chat lifecycle.</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Invitation Success</p>
                  <p className="text-xl font-bold text-indigo-600">{stats.invitationSuccessRate}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Coffee Conversion</p>
                  <p className="text-xl font-bold text-emerald-600">{stats.coffeeConversionRate}%</p>
                </div>
              </div>
            </header>

            {/* NEW: Today's Follow-up Hub Module */}
            {followUpQueue.length > 0 && (
              <div className="bg-white border border-rose-100 rounded-2xl shadow-sm overflow-hidden mb-8">
                <div className="bg-rose-50/50 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs">
                      <i className="fa-solid fa-bell-on"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Today's Follow-up Hub</h3>
                      <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Requires Immediate Action</p>
                    </div>
                  </div>
                  <span className="text-xs bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-bold">
                    {followUpQueue.length} Pending Actions
                  </span>
                </div>
                <div className="p-4 flex gap-4 overflow-x-auto">
                  {followUpQueue.map(c => {
                    const overdueDays = Math.floor((new Date(today).getTime() - new Date(c.nextFollowUpDate).getTime()) / 86400000);
                    const pendingEvents = c.oneOffEvents.filter(e => !e.completed && e.notifyDate <= today);
                    
                    return (
                      <div 
                        key={c.id} 
                        onClick={() => setSelectedContact(c)}
                        className="flex-shrink-0 w-64 bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition">{c.name}</p>
                          <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-3">{c.position} @ {c.company}</p>
                        
                        <div className="space-y-1">
                          {c.nextFollowUpDate <= today && (
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-400">Nurture Cycle</span>
                              <span className={`font-bold ${overdueDays > 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                                {overdueDays > 0 ? `${overdueDays}d overdue` : 'Due today'}
                              </span>
                            </div>
                          )}
                          {pendingEvents.map(e => (
                            <div key={e.id} className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-400 truncate pr-2">Event: {e.name}</span>
                              <span className="font-bold text-indigo-600">Action needed</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <KanbanBoard contacts={contacts} onContactClick={(c) => setSelectedContact(c)} />
          </div>
        )}

        {/* Tab Content: Insights */}
        {activeTab === 'insights' && (
          <AIInsights contacts={contacts} />
        )}

        {/* Tab Content: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Growth Trends</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData}>
                    <defs>
                      <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="connections" stroke="#6366f1" fillOpacity={1} fill="url(#colorConnections)" strokeWidth={3} />
                    <Area type="monotone" dataKey="chats" stroke="#10b981" fillOpacity={1} fill="url(#colorChats)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-800 mb-6">Pipeline Health</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Invitation Flow</span>
                      <span className="text-slate-900 font-bold">{stats.invitationSuccessRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${stats.invitationSuccessRate}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Coffee Meetings</span>
                      <span className="text-slate-900 font-bold">{stats.coffeeConversionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${stats.coffeeConversionRate}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  "The value of a network is not in how many people you know, but in how many people you have helped."
                </p>
                <p className="text-xs text-indigo-600 font-bold mt-2">— Kinetic Philosophy</p>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {selectedContact && (
          <ContactDetail 
            contact={selectedContact} 
            onClose={() => setSelectedContact(null)} 
          />
        )}
      </main>

      {/* Persistent Call-to-Action for Chrome Extension Link (Mock) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button className="bg-white text-slate-800 border border-slate-200 shadow-xl rounded-full pl-4 pr-6 py-3 flex items-center gap-3 hover:scale-105 transition active:scale-95 group">
          <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white">
            <i className="fa-brands fa-chrome"></i>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 leading-none">Sync Extension</p>
            <p className="text-sm font-bold group-hover:text-indigo-600 transition">Import LinkedIn Profiles</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default App;
