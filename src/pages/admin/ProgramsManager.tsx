import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface Program {
    id: number;
    name_en: string;
    name_fr: string;
    type: string;
    options_en: string[];
    options_fr: string[];
    icon: string;
}

const ProgramsManager: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Program | null>(null);
    const [formData, setFormData] = useState({
        name_en: '',
        name_fr: '',
        type: 'faculty',
        options_en: '',
        options_fr: '',
        icon: 'Globe',
    });

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await api.get('/programs');
            setPrograms(response.data);
        } catch (err) {
            console.error('Failed to fetch programs', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...formData,
            options_en: formData.options_en.split(',').map(s => s.trim()).filter(s => s),
            options_fr: formData.options_fr.split(',').map(s => s.trim()).filter(s => s),
        };
        try {
            if (editingItem) {
                await api.put(`/programs/${editingItem.id}`, data);
            } else {
                await api.post('/programs', data);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            setFormData({
                name_en: '',
                name_fr: '',
                type: 'faculty',
                options_en: '',
                options_fr: '',
                icon: 'Globe',
            });
            fetchPrograms();
        } catch (err) {
            alert('Failed to save program');
        }
    };

    const handleEdit = (item: Program) => {
        setEditingItem(item);
        setFormData({
            name_en: item.name_en,
            name_fr: item.name_fr,
            type: item.type,
            options_en: (item.options_en || []).join(', '),
            options_fr: (item.options_fr || []).join(', '),
            icon: item.icon || 'Globe',
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this program?')) {
            try {
                await api.delete(`/programs/${id}`);
                setPrograms(programs.filter(item => item.id !== id));
            } catch (err) {
                alert('Failed to delete program');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Manage Programs</h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({
                            name_en: '',
                            name_fr: '',
                            type: 'faculty',
                            options_en: '',
                            options_fr: '',
                            icon: 'Globe',
                        });
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    <span>Add Program</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-700">Name (EN)</th>
                            <th className="p-4 font-semibold text-gray-700">Type</th>
                            <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr>
                        ) : programs.length === 0 ? (
                            <tr><td colSpan={3} className="p-4 text-center">No programs found.</td></tr>
                        ) : (
                            programs.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4">{item.name_en}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${item.type === 'faculty' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-gray-600 hover:text-red-600"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">{editingItem ? 'Edit Program' : 'Add Program'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name (EN)</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={formData.name_en}
                                        onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name (FR)</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={formData.name_fr}
                                        onChange={e => setFormData({ ...formData, name_fr: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="faculty">Faculty</option>
                                        <option value="professional_course">Professional Course</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Icon (Lucide name)</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={formData.icon}
                                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Options (EN) - Comma separated</label>
                                <textarea
                                    className="w-full p-2 border rounded h-24"
                                    value={formData.options_en}
                                    onChange={e => setFormData({ ...formData, options_en: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Options (FR) - Comma separated</label>
                                <textarea
                                    className="w-full p-2 border rounded h-24"
                                    value={formData.options_fr}
                                    onChange={e => setFormData({ ...formData, options_fr: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgramsManager;
