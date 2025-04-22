import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import IconMenuMailbox from '../Icon/Menu/IconMenuMailbox';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar';
import IconBook from '../Icon/IconBook';
import IconBookmark from '../Icon/IconBookmark';
import IconFile from '../Icon/IconFile';
import IconFolder from '../Icon/IconFolder';
import IconHome from '../Icon/IconHome';
import IconChecks from '../Icon/IconChecks';
import axios from 'axios';

const Sidebar = () => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [userEmail, setUserEmail] = useState<string>('');
    const dispatch = useDispatch();
    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:5000/user-info', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setIsAdmin(response.data.is_admin === 1 || response.data.is_admin === true);
                setUserEmail(response.data.email);
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024) {
            dispatch(toggleSidebar());
        }
    }, [location, dispatch]);

    if (loading) {
        return (
            <div className="sidebar fixed min-h-screen w-[260px] bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    // Common apps for all users
    const commonApps = [
        { path: '/apps/feed', icon: <IconMenuDashboard className="w-5 h-5" />, label: 'Feed' },
        { path: '/apps/chats', icon: <IconMenuChat className="w-5 h-5" />, label: 'Chat' },
        { path: '/apps/mailbox', icon: <IconMenuMailbox className="w-5 h-5" />, label: 'Email' },
        { path: '/apps/drive', icon: <IconFolder className="w-5 h-5" />, label: 'Drive' },
        { path: '/apps/todolist', icon: <IconChecks className="w-5 h-5" />, label: 'Todo List' },
        { path: '/apps/taskandprojects', icon: <IconBookmark className="w-5 h-5" />, label: 'Task And Projects' },
        { path: '/apps/scrumboard', icon: <IconMenuScrumboard className="w-5 h-5" />, label: 'Scrumboard' },
        { path: '/apps/onlinedocument', icon: <IconFile className="w-5 h-5" />, label: 'Online Documents' },
        { path: '/apps/calendar', icon: <IconMenuCalendar className="w-5 h-5" />, label: 'Calendar' }
    ];

    // Admin specific items
    const adminItems = [
        { path: '/admin/users', icon: <IconBook className="w-5 h-5" />, label: 'Manage Users' },
        { path: '/admin/reports', icon: <IconFile className="w-5 h-5" />, label: 'Reports' }
    ];

    return (
        <div className="sidebar fixed min-h-screen w-[260px] shadow-lg z-50 bg-white dark:bg-gray-800">
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <NavLink to="/" className="main-logo flex items-center">
                        <img className="w-8" src="/assets/images/logo.svg" alt="logo" />
                        <span className="text-xl font-semibold text-black dark:text-white ml-2">EMS</span>
                    </NavLink>
                    <button
                        type="button"
                        className="collapse-icon w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => dispatch(toggleSidebar())}
                    >
                        <IconCaretsDown className="w-4 h-4 rotate-90" />
                    </button>
                </div>

                {/* User email */}
                {userEmail && (
                    <div className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        {userEmail}
                    </div>
                )}

                {/* Navigation */}
                <PerfectScrollbar className="flex-1">
                    <div className="p-4">
                        {/* Dashboard */}
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `flex items-center px-3 py-2.5 rounded-lg mb-1 ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
                            }
                        >
                            <IconHome className="w-5 h-5" />
                            <span className="ml-3 font-medium">Dashboard</span>
                        </NavLink>

                        {/* Apps Section */}
                        <div className="mt-6">
                            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Apps
                            </h3>
                            <div className="space-y-1">
                                {commonApps.map((app, index) => (
                                    <NavLink
                                        key={index}
                                        to={app.path}
                                        className={({ isActive }) => 
                                            `flex items-center px-3 py-2.5 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
                                        }
                                    >
                                        {app.icon}
                                        <span className="ml-3 font-medium">{app.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        {/* Admin Section */}
                        {isAdmin && (
                            <div className="mt-6">
                                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Admin
                                </h3>
                                <div className="space-y-1">
                                    {adminItems.map((item, index) => (
                                        <NavLink
                                            key={`admin-${index}`}
                                            to={item.path}
                                            className={({ isActive }) => 
                                                `flex items-center px-3 py-2.5 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
                                            }
                                        >
                                            {item.icon}
                                            <span className="ml-3 font-medium">{item.label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </PerfectScrollbar>
            </div>
        </div>
    );
};

export default Sidebar;