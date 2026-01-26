import React from 'react';
import { Newspaper, FileText, Users, BookOpen } from 'lucide-react';

const Dashboard: React.FC = () => {
    const stats = [
        { label: 'Total News', value: '12', icon: Newspaper, color: 'bg-blue-500' },
        { label: 'Active Tenders', value: '5', icon: FileText, color: 'bg-green-500' },
        { label: 'Partners', value: '15', icon: Users, color: 'bg-purple-500' },
        { label: 'Programs', value: '8', icon: BookOpen, color: 'bg-orange-500' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-8">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
                        <div className={`${stat.color} p-4 rounded-lg text-white`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Welcome to EALI Admin Panel</h3>
                <p className="text-gray-600">
                    Use the sidebar to manage different sections of the website. You can add, edit, or delete news, tenders, partners, and programs.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
