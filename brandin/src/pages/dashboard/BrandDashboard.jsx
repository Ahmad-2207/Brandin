import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  CheckCircle2, UserPlus, Star, ChevronDown, 
  MoreVertical, ArrowUpRight, TrendingUp, Bell, RefreshCw,
  Megaphone, FileText, Send, XCircle, Handshake, DollarSign,
  CreditCard, UserCheck, PenTool, Package, BadgeCheck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { getOptimizedImage } from '../../utils/imageOptimization';
import { fetchNotifications } from '../../redux/slices/notificationSlice';

// --- MOCK DATA FOR STATIC UI ---
const mockGraphData = [
  { name: 'Mon', facebook: 4000, instagram: 2400 },
  { name: 'Tue', facebook: 3000, instagram: 1398 },
  { name: 'Wed', facebook: 2000, instagram: 9800 },
  { name: 'Thu', facebook: 2780, instagram: 3908 },
  { name: 'Fri', facebook: 1890, instagram: 4800 },
  { name: 'Sat', facebook: 2390, instagram: 3800 },
  { name: 'Sun', facebook: 3490, instagram: 4300 },
];

const mockMessages = [
  { id: 1, name: 'Sarah K.', desc: "I've just uploaded the draft content...", time: '2m ago', initial: 'S', color: 'bg-orange-100 text-orange-600', status: 'online' },
  { id: 2, name: 'Marcus R.', desc: "The contract looks great! Let's proceed.", time: '1h ago', initial: 'M', color: 'bg-blue-100 text-blue-600', status: 'online' },
  { id: 3, name: 'Elena V.', desc: "Can we discuss the eco-home brief?", time: '4h ago', initial: 'E', color: 'bg-emerald-100 text-emerald-600', status: 'online' },
  { id: 4, name: 'Jordan Lee', desc: "Thanks for the update!", time: 'Yesterday', initial: 'J', color: 'bg-gray-100 text-gray-600', status: 'offline' },
];

const mockCampaigns = [
  { id: 1, name: 'Summer Glow 2024', status: 'Live', progress: 75, color: 'bg-orange-100 text-orange-600' },
  { id: 2, name: 'Eco-home Series', status: 'Live', progress: 31, color: 'bg-emerald-100 text-emerald-600' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-1 z-50">
        <p className="text-xs font-bold text-gray-900 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
          <p className="text-xs text-gray-600">Instagram: <span className="font-bold text-gray-900">{payload[0].value}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#a855f7]" />
          <p className="text-xs text-gray-600">Facebook: <span className="font-bold text-gray-900">{payload[1].value}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

// Helper: maps real backend notification `type` to an icon + color
const getActivityStyle = (type = '', title = '') => {
  const t = type?.toLowerCase() || '';
  const lowerTitle = title?.toLowerCase() || '';

  // --- Campaigns ---
  if (t === 'campaign_created')
    return { icon: <Megaphone className="w-4 h-4 text-blue-500" />, bg: 'bg-blue-50' };
  if (t === 'campaign_updated')
    return { icon: <PenTool className="w-4 h-4 text-amber-500" />, bg: 'bg-amber-50' };
  if (t === 'campaign_deleted' || t === 'campaign_cancelled')
    return { icon: <XCircle className="w-4 h-4 text-red-500" />, bg: 'bg-red-50' };

  // --- Collaboration Requests ---
  if (t === 'collaboration_request_sent' || t === 'collab_request_sent')
    return { icon: <Send className="w-4 h-4 text-indigo-500" />, bg: 'bg-indigo-50' };
  if (t === 'collaboration_accepted' || t === 'collab_request_accepted')
    return { icon: <UserCheck className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-50' };
  if (t === 'collaboration_started')
    return { icon: <Handshake className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50' };
  if (t === 'collaboration_completed')
    return { icon: <BadgeCheck className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50' };
  if (t.includes('rejected') || t.includes('cancelled'))
    return { icon: <XCircle className="w-4 h-4 text-red-500" />, bg: 'bg-red-50' };

  // --- Deliverables ---
  if (t === 'deliverable_submitted')
    return { icon: <Package className="w-4 h-4 text-violet-500" />, bg: 'bg-violet-50' };
  if (t === 'deliverable_approved' || t === 'deliverable_approved_paid')
    return { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-50' };
  if (t === 'deliverable_revision_requested' || t === 'deliverable_updated')
    return { icon: <FileText className="w-4 h-4 text-orange-500" />, bg: 'bg-orange-50' };

  // --- Payments ---
  if (t === 'payout_released' || t === 'escrow_funded' || t === 'escrow_funding')
    return { icon: <DollarSign className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50' };
  if (t === 'waterfall_refund')
    return { icon: <CreditCard className="w-4 h-4 text-red-500" />, bg: 'bg-red-50' };

  // --- Agreement ---
  if (t === 'agreement_signed')
    return { icon: <Handshake className="w-4 h-4 text-teal-500" />, bg: 'bg-teal-50' };

  // --- Profile / System ---
  if (t === 'profile_updated' || lowerTitle.includes('profile'))
    return { icon: <UserPlus className="w-4 h-4 text-blue-500" />, bg: 'bg-blue-50' };

  // --- Milestones (title-based fallback) ---
  if (lowerTitle.includes('milestone') || lowerTitle.includes('achieved'))
    return { icon: <Star className="w-4 h-4 text-purple-500" />, bg: 'bg-purple-50' };

  // --- Task assignment ---
  if (t.includes('task') || lowerTitle.includes('task'))
    return { icon: <CheckCircle2 className="w-4 h-4 text-sky-500" />, bg: 'bg-sky-50' };

  // --- Ultimate fallback ---
  return { icon: <Bell className="w-4 h-4 text-slate-500" />, bg: 'bg-slate-50' };
};

export default function BrandDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: notifications, loading: loadingNotifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const recentActivity = notifications?.slice(0, 3) || [];

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      
      {/* Top Row: Hero & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hero Card */}
        <div className="lg:col-span-8 bg-[#2563eb] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-md">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Welcome back, {user?.name || 'Alex'}</h1>
              <p className="text-blue-100 text-sm sm:text-base max-w-md leading-relaxed">
                Your campaigns are performing 14% better than last month. Here's your current growth overview.
              </p>
            </div>
            
            <div className="flex items-baseline gap-3">
              <h2 className="text-5xl sm:text-6xl font-black tracking-tighter">+24.8%</h2>
              <p className="text-blue-100 font-medium">Growth this month</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2e8f0] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">Recent Activity</h3>
            <button 
               onClick={() => dispatch(fetchNotifications())}
               disabled={loadingNotifications}
               className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
               <RefreshCw className={`w-4 h-4 ${loadingNotifications ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="flex flex-col gap-5 flex-1 justify-center">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => {
                const style = getActivityStyle(activity.type);
                return (
                  <div key={activity._id || activity.id} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                      {style.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1e293b]">{activity.title}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {activity.message} • {formatDistanceToNow(new Date(activity.createdAt || Date.now()), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-500 text-sm py-4">No recent activity</div>
            )}
          </div>
        </div>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0] flex flex-col justify-between h-36">
           <div className="flex justify-between items-start">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Reach</h4>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">+12%</span>
           </div>
           <div>
              <h2 className="text-3xl font-black text-[#1e293b] tracking-tight">1.2M</h2>
           </div>
           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-blue-500 w-[70%]" />
           </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0] flex flex-col justify-between h-36">
           <div className="flex justify-between items-start">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg. Engagement</h4>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">+0.6%</span>
           </div>
           <div>
              <h2 className="text-3xl font-black text-[#1e293b] tracking-tight">4.8%</h2>
           </div>
           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-purple-500 w-[45%]" />
           </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0] flex flex-col justify-between h-36">
           <div className="flex justify-between items-start">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Campaign ROI</h4>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">+0.4x</span>
           </div>
           <div>
              <h2 className="text-3xl font-black text-[#1e293b] tracking-tight">3.2x</h2>
           </div>
           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-emerald-500 w-[80%]" />
           </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0] flex flex-col justify-between h-36">
           <div className="flex justify-between items-start">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Creators</h4>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Steady</span>
           </div>
           <div className="flex items-center justify-between mt-auto">
              <h2 className="text-3xl font-black text-[#1e293b] tracking-tight">18</h2>
              <div className="flex -space-x-2">
                 <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-600">S</div>
                 <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-600">M</div>
                 <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs font-bold text-orange-600">E</div>
                 <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">+15</div>
              </div>
           </div>
        </div>

      </div>

      {/* Middle Row: Graph & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Collaborations Graph */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2e8f0] flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-lg font-bold text-[#1e293b]">Collaborations Graph</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Weekly engagement metrics</p>
             </div>
             <button className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors border border-slate-200">
                Last 30 Days
                <ChevronDown className="w-3 h-3" />
             </button>
          </div>
          
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockGraphData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
                   dy={10}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
                   dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                {/* Stacked Bars */}
                <Bar dataKey="instagram" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="facebook" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2e8f0] flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">Recent Messages</h3>
              <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
           </div>

           <div className="flex flex-col gap-5 flex-1">
             {mockMessages.map(msg => (
               <div key={msg.id} className="flex items-start gap-4 group cursor-pointer">
                  <div className="relative">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${msg.color}`}>
                        {msg.initial}
                     </div>
                     <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${msg.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-bold text-[#1e293b] truncate">{msg.name}</p>
                        <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap ml-2">{msg.time}</span>
                     </div>
                     <p className="text-xs font-medium text-slate-500 truncate">{msg.desc}</p>
                  </div>
               </div>
             ))}
           </div>
        </div>

      </div>

      {/* Bottom Row: AI Match & Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* AI Match Spotlight */}
        <div className="lg:col-span-4 bg-[#f8faff] rounded-3xl p-6 sm:p-8 shadow-sm border border-blue-100 flex flex-col">
           <div className="flex items-center gap-2 mb-6">
              <Star className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wider">AI Match Spotlight</h3>
           </div>
           
           <div className="flex flex-col gap-4 mb-6">
              {/* Match 1 */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e2e8f0] flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">S</div>
                    <div>
                       <p className="text-sm font-bold text-[#1e293b]">Sarah K.</p>
                       <p className="text-[10px] font-semibold text-slate-500 uppercase">Lifestyle & Travel</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-black text-blue-600">98%</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Match</p>
                 </div>
              </div>

              {/* Match 2 */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e2e8f0] flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">M</div>
                    <div>
                       <p className="text-sm font-bold text-[#1e293b]">Marcus R.</p>
                       <p className="text-[10px] font-semibold text-slate-500 uppercase">Tech & Gadgets</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-black text-blue-600">94%</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Match</p>
                 </div>
              </div>
           </div>

           <button className="mt-auto w-full py-3 bg-white hover:bg-blue-50 text-blue-600 font-bold text-sm rounded-xl transition-colors border border-blue-100">
              View Discovery Lab
           </button>
        </div>

        {/* Active Campaigns Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2e8f0] flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1e293b]">Active Campaigns</h3>
              <button className="text-xs font-bold text-blue-600 hover:underline">Manage All</button>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="border-b border-[#e2e8f0]">
                   <tr>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign Name</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-1/3">Budget</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                   {mockCampaigns.map(camp => (
                     <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${camp.color}`}>
                                 <TrendingUp className="w-4 h-4" />
                              </div>
                              <p className="text-sm font-bold text-[#1e293b]">{camp.name}</p>
                           </div>
                        </td>
                        <td className="py-4">
                           <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                              {camp.status}
                           </span>
                        </td>
                        <td className="py-4">
                           <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500 rounded-full" style={{ width: `${camp.progress}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-600 w-8">{camp.progress}%</span>
                           </div>
                        </td>
                        <td className="py-4 text-right">
                           <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>

      </div>

    </div>
  );
}