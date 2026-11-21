import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard, Search, FileText, Settings, User,
  LogOut, Target, Handshake, Building2, MessageCircle, CreditCard,
  HelpCircle
} from "lucide-react";
import { clearPendingRequestCount, clearActiveCollabCount } from "../../redux/slices/collaborationSlice";
import { useDashboardContext } from "../../context/DashboardContext";
import { useAuth } from "../../hooks/useAuth";

const brandNavItems = [
  { icon: LayoutDashboard, label: "Dashboard",   path: "/brand/dashboard" },
  { icon: Search,          label: "Influencer",  path: "/brand/influencer" },
  { icon: FileText,        label: "My Requests", path: "/brand/requests" },
  { icon: Handshake,       label: "Collaborations",     path: "/brand/collaborations" },
  { icon: Target,          label: "Campaigns",          path: "/brand/campaigns" },
  { icon: MessageCircle,   label: "Messages",           path: "/messages" },
  { icon: CreditCard,      label: "Payments",           path: "/brand/payments" },
  { icon: User,            label: "My Profile",         path: "/brand/profile" },
];

const influencerNavItems = [
  { icon: LayoutDashboard, label: "Dashboard",              path: "/influencer/dashboard" },
  { icon: Building2,       label: "Search Brands",          path: "/influencer/search/campaigns" },
  { icon: FileText,        label: "Collaboration Requests", path: "/influencer/requests" },
  { icon: Handshake,       label: "Collaborations",         path: "/influencer/collaborations" },
  { icon: MessageCircle,   label: "Messages",               path: "/messages" },
  { icon: CreditCard,      label: "Payments",               path: "/influencer/payments" },
  { icon: User,            label: "My Profile",             path: "/influencer/profile" },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Target,          label: "Campaigns", path: "/admin/campaigns" },
  { icon: Settings,        label: "Settings",  path: "/admin/settings" },
];

export default function Sidebar({ isCollapsed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const { conversations } = useSelector((state) => state.chat || { conversations: [] });
  const { pendingRequestCount, activeCollabCount } = useSelector(
    (state) => state.collaboration
  );
  
  const { isSidebarOpen: isOpen, closeSidebar: onClose } = useDashboardContext();
  const userRole = user?.role || 'brand';

  const unreadMessageCount = conversations.reduce((count, conv) => {
    if (conv.lastMessage && !conv.lastMessage.isRead) {
      const senderId = conv.lastMessage.sender?._id || conv.lastMessage.sender;
      if (String(senderId) !== String(user?._id)) {
        return count + 1;
      }
    }
    return count;
  }, 0);

  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname.includes("/requests")) {
      dispatch(clearPendingRequestCount());
    }
    if (location.pathname.includes("/collaborations")) {
      dispatch(clearActiveCollabCount());
    }
    // Note: Messages are cleared in ChatLayout when a specific conversation is opened,
    // but we can also clear the global "new message" indicator if needed.
  }, [location.pathname, dispatch]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems =
    userRole === "brand"      ? brandNavItems :
    userRole === "influencer" ? influencerNavItems :
    adminNavItems;

  const showCompletionWarning =
    user && !user.profileComplete && userRole !== "admin" && !isCollapsed;

  return (
    <>
      <aside
        className={`
          fixed lg:static left-0 z-30 bg-white border-r border-[#e2e8f0]
          flex flex-col transition-all duration-300 ease-in-out
          lg:translate-x-0 top-[80px] lg:top-0 h-[calc(100vh-80px)] lg:h-full
          ${isCollapsed ? "w-20" : "w-64 xl:w-72"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >


        <nav className={`flex-1 flex flex-col ${isCollapsed ? 'px-2' : 'px-3'} py-4 space-y-1 overflow-y-auto overflow-x-hidden`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isProfilePage = item.path.includes("profile");
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={isCollapsed ? item.label : ""}
                className={({ isActive }) =>
                  `relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? "bg-[#eff6ff] text-[#3b82f6] shadow-sm ring-1 ring-inset ring-[#bfdbfe]"
                    : "text-[#64748b] hover:bg-[#f8f9fb] hover:text-[#1e293b]"
                  }`
                }
              >
                <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-[18px] h-[18px]'} flex-shrink-0`} />
                {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                
                {/* Red dot on profile when profile incomplete */}
                {isProfilePage && showCompletionWarning && !isCollapsed && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
                )}
                
                {/* Unread message badge */}
                {item.label === "Messages" && unreadMessageCount > 0 && (
                  <span className={`
                    absolute ${isCollapsed ? 'top-1 right-1' : 'right-3 top-1/2 -translate-y-1/2'}
                    flex items-center justify-center min-w-[18px] h-[18px] px-1
                    bg-indigo-500 text-white text-[9px] font-black rounded-full
                    shadow-[0_0_8px_rgba(99,102,241,0.6)]
                  `}>
                    {unreadMessageCount}
                  </span>
                )}

                {/* Pending Requests badge */}
                {(item.label === "My Requests" || item.label === "Collaboration Requests") && pendingRequestCount > 0 && (
                  <span className={`
                    absolute ${isCollapsed ? 'top-1 right-1' : 'right-3 top-1/2 -translate-y-1/2'}
                    flex items-center justify-center min-w-[18px] h-[18px] px-1
                    bg-orange-500 text-white text-[9px] font-black rounded-full
                    shadow-[0_0_8px_rgba(249,115,22,0.6)]
                  `}>
                    {pendingRequestCount}
                  </span>
                )}

                {/* Active Collaborations badge */}
                {item.label === "Collaborations" && activeCollabCount > 0 && (
                  <span className={`
                    absolute ${isCollapsed ? 'top-1 right-1' : 'right-3 top-1/2 -translate-y-1/2'}
                    flex items-center justify-center min-w-[18px] h-[18px] px-1
                    bg-emerald-500 text-white text-[9px] font-black rounded-full
                    shadow-[0_0_8px_rgba(16,185,129,0.6)]
                  `}>
                    {activeCollabCount}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="flex-1" />

          {/* Bottom Actions */}
          <div className="flex flex-col gap-1 mt-auto pt-4">
            {userRole === 'brand' && (
              <button
                onClick={() => { onClose(); navigate('/brand/campaigns'); }}
                title={isCollapsed ? "Create Campaign" : ""}
                className={`flex items-center justify-center ${isCollapsed ? 'p-2' : 'py-2.5 px-4 mx-2'} rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 mb-4 shadow-sm`}
              >
                {!isCollapsed && <span>Create Campaign</span>}
                {isCollapsed && <Target className="w-5 h-5" />}
              </button>
            )}

            <NavLink
              to="/help-center"
              onClick={onClose}
              title={isCollapsed ? "Help Center" : ""}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? "bg-[#eff6ff] text-[#3b82f6]" : "text-[#64748b] hover:bg-[#f8f9fb] hover:text-[#1e293b]"}`
              }
            >
              <HelpCircle className={`${isCollapsed ? 'w-6 h-6' : 'w-[18px] h-[18px]'} flex-shrink-0`} />
              {!isCollapsed && <span>Help Center</span>}
            </NavLink>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title={isCollapsed ? "Sign Out" : ""}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2.5 rounded-lg text-sm font-medium text-[#64748b] hover:text-red-600 hover:bg-red-50 transition-colors duration-200`}
            >
              <LogOut className={`${isCollapsed ? 'w-6 h-6' : 'w-[18px] h-[18px]'} flex-shrink-0`} />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}