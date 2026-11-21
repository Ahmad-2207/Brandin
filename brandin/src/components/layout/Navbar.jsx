import { Bell, Menu, X, Shield, MessageCircle, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VerifiedTick from '../common/VerifiedTick';
import { useDashboardContext } from '../../context/DashboardContext';
import { getOptimizedImage } from '../../utils/imageOptimization';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { roleProfile } = useSelector((state) => state.profile);
  const { unreadCount: notificationCount } = useSelector((state) => state.notifications);
  
  const {
    isSidebarOpen,
    toggleSidebar,
    toggleNotifications,
    toggleProfile,
  } = useDashboardContext();

  const userRole = user?.role || 'brand';
  const isBrand = userRole === 'brand';
  const isInfluencer = userRole === 'influencer';

  // Dynamic names
  const brandName = roleProfile?.brandname;
  const influencerName = roleProfile?.username;
  const fullName = user?.fullname;

  const displayName = 
    isBrand ? (brandName || fullName || 'Brand') : 
    isInfluencer ? (influencerName || fullName || 'Influencer') : 
    (fullName || 'User');

  const userEmail = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  const navigate = useNavigate();
  // removed messages logic from here

  // Dynamic avatars
  const avatarUrl = user?.profilePic || (isBrand ? roleProfile?.logo : roleProfile?.profilePicture);
  
  const roleLabel = 
    userRole === 'admin' ? 'ADMIN' : 
    userRole === 'brand' ? 'BRAND' : 
    'INFLUENCER';

  const roleTitle = 
    userRole === 'admin' ? 'Admin Panel' : 
    userRole === 'brand' ? 'Brand Dashboard' : 
    'Influencer Dashboard';

  const roleBgColor = 
    userRole === 'admin' ? 'bg-indigo-500' : 
    userRole === 'brand' ? 'bg-blue-500' : 
    'bg-emerald-500';

  return (
    <header className="bg-white border-b border-[#e2e8f0] shadow-sm sticky top-0 z-40 h-[80px]">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left: hamburger + logo + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-[#64748b] hover:text-[#1e293b] p-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
            {/* Mobile View: Just B */}
            <span className="text-2xl font-bold text-[#3b82f6] sm:hidden">B</span>
            
            {/* Desktop View: Full Brandly */}
            <span className="text-2xl font-bold text-[#3b82f6] hidden sm:block">Brandly</span>
            
            {/* Dashboard Role Badge */}
            <span className="hidden lg:flex items-center px-2 py-0.5 ml-2 text-[10px] uppercase tracking-wider font-bold text-[#64748b] bg-slate-100 rounded-md border border-[#e2e8f0]">
              {roleTitle}
            </span>
          </div>
        </div>

        {/* Middle: Search Bar (Hidden on small screens) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-[#94a3b8]" />
            </div>
            <input
              type="text"
              className="block w-full py-2.5 pl-10 pr-4 text-sm text-[#1e293b] bg-[#f1f5f9] border-transparent rounded-full focus:ring-blue-500 focus:border-blue-500 placeholder-[#94a3b8] focus:bg-white focus:outline-none transition-colors"
              placeholder="Search campaigns, influencers..."
            />
          </div>
        </div>

        {/* Right: notifications + profile */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button
            onClick={toggleNotifications}
            className="relative p-2 text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>


          {/* Profile trigger */}
          <button
            onClick={toggleProfile}
            className="flex items-center gap-2.5 pl-3 border-l border-[#e2e8f0] hover:opacity-80 transition-opacity"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-slate-50 border border-[#e2e8f0] flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img loading="lazy" decoding="async" src={getOptimizedImage(avatarUrl, 'chat')} alt={displayName} className="w-full h-full object-cover" width="36" height="36" />
                ) : (
                  <span className="text-[#64748b] font-semibold text-sm">{initial}</span>
                )}
              </div>
              {/* Status dot */}
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                user?.status === 'offline' ? 'bg-gray-400' : 'bg-green-500'
              }`} />
            </div>

            {/* Name + role + email */}
            <div className="hidden md:block text-left">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-[#1e293b] leading-tight">{displayName}</p>
                <VerifiedTick user={user} roleProfile={roleProfile} size="xs" />
              </div>
              <p className="text-xs text-[#64748b] leading-tight">
                <span className={`font-bold ${userRole === 'brand' ? 'text-[#3b82f6]' : 'text-emerald-500'}`}>
                  {roleLabel}
                </span>
                {userEmail && (
                  <>
                    {' '}
                    <span className="text-[#94a3b8]">
                      {userEmail.length > 16
                        ? userEmail.substring(0, 16) + '...'
                        : userEmail}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Chevron */}
            <svg className="w-4 h-4 text-[#94a3b8] hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
