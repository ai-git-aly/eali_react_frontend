import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, FileText, Users, BookOpen, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Newspaper, label: 'News', path: '/admin/news' },
        { icon: FileText, label: 'Tenders', path: '/admin/tenders' },
        { icon: Users, label: 'Partners', path: '/admin/partners' },
        { icon: BookOpen, label: 'Programs', path: '/admin/programs' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-gray-800">
                    EALI Admin
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center space-x-3 p-3 rounded hover:bg-gray-800 transition"
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <button
                    onClick={handleLogout}
                    className="p-4 flex items-center space-x-3 hover:bg-gray-800 transition border-t border-gray-800"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-800">Admin Management</h1>
                    <div className="text-gray-600">Admin User</div>
                </header>
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
