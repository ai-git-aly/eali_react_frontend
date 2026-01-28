import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Program {
    id: number;
    name_en: string;
    name_fr: string;
    type: string;
    options_en: string[];
    options_fr: string[];
    icon: string;
    description_en?: string;
    description_fr?: string;
    duration?: string;
    degree_en?: string;
    degree_fr?: string;
    admission_requirements_en?: string;
    admission_requirements_fr?: string;
    career_opportunities_en?: string;
    career_opportunities_fr?: string;
    image_url?: string;
}

const ProgramsManager: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Program | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [formData, setFormData] = useState({
        name_en: '',
        name_fr: '',
        type: 'faculty',
        options_en: '',
        options_fr: '',
        icon: 'Globe',
        description_en: '',
        description_fr: '',
        duration: '',
        degree_en: '',
        degree_fr: '',
        admission_requirements_en: '',
        admission_requirements_fr: '',
        career_opportunities_en: '',
        career_opportunities_fr: '',
        image_url: '',
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

    const resetFormData = () => {
        setFormData({
            name_en: '',
            name_fr: '',
            type: 'faculty',
            options_en: '',
            options_fr: '',
            icon: 'Globe',
            description_en: '',
            description_fr: '',
            duration: '',
            degree_en: '',
            degree_fr: '',
            admission_requirements_en: '',
            admission_requirements_fr: '',
            career_opportunities_en: '',
            career_opportunities_fr: '',
            image_url: '',
        });
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
            resetFormData();
            setShowAdvanced(false);
            fetchPrograms();
        } catch (err) {
            alert('Failed to save program');
        }
    };

    const handleEdit = (item: Program) => {
        setEditingItem(item);
        setFormData({
            name_en: item.name_en || '',
            name_fr: item.name_fr || '',
            type: item.type || 'faculty',
            options_en: (item.options_en || []).join(', '),
            options_fr: (item.options_fr || []).join(', '),
            icon: item.icon || 'Globe',
            description_en: item.description_en || '',
            description_fr: item.description_fr || '',
            duration: item.duration || '',
            degree_en: item.degree_en || '',
            degree_fr: item.degree_fr || '',
            admission_requirements_en: item.admission_requirements_en || '',
            admission_requirements_fr: item.admission_requirements_fr || '',
            career_opportunities_en: item.career_opportunities_en || '',
            career_opportunities_fr: item.career_opportunities_fr || '',
            image_url: item.image_url || '',
        });
        setShowAdvanced(true);
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
                        resetFormData();
                        setShowAdvanced(false);
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
                            <th className="p-4 font-semibold text-gray-700">Duration</th>
                            <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
                        ) : programs.length === 0 ? (
                            <tr><td colSpan={4} className="p-4 text-center">No programs found.</td></tr>
                        ) : (
                            programs.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4">{item.name_en}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${item.type === 'faculty' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{item.duration || '-'}</td>
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
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold">{editingItem ? 'Edit Program' : 'Add Program'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Name (EN) *</label>
                                        <input
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.name_en}
                                            onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Name (FR) *</label>
                                        <input
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.name_fr}
                                            onChange={e => setFormData({ ...formData, name_fr: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Type *</label>
                                        <select
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.icon}
                                            onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                            placeholder="e.g., BookOpen, Briefcase"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Duration</label>
                                        <input
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                            placeholder="e.g., 3 years"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Options/Specializations (EN) - Comma separated</label>
                                        <textarea
                                            className="w-full p-2 border rounded h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.options_en}
                                            onChange={e => setFormData({ ...formData, options_en: e.target.value })}
                                            placeholder="Option 1, Option 2, Option 3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Options/Specializations (FR) - Comma separated</label>
                                        <textarea
                                            className="w-full p-2 border rounded h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.options_fr}
                                            onChange={e => setFormData({ ...formData, options_fr: e.target.value })}
                                            placeholder="Option 1, Option 2, Option 3"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Advanced / Learn More Section Toggle */}
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
                            >
                                {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                {showAdvanced ? 'Hide' : 'Show'} Learn More Details
                            </button>

                            {/* Learn More Details */}
                            {showAdvanced && (
                                <div className="space-y-4 border-t pt-4">
                                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Learn More Details</h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Degree Awarded (EN)</label>
                                            <input
                                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.degree_en}
                                                onChange={e => setFormData({ ...formData, degree_en: e.target.value })}
                                                placeholder="e.g., Bachelor's Degree"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Degree Awarded (FR)</label>
                                            <input
                                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.degree_fr}
                                                onChange={e => setFormData({ ...formData, degree_fr: e.target.value })}
                                                placeholder="e.g., Licence"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Banner Image URL</label>
                                        <input
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.image_url}
                                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Description (EN)</label>
                                            <textarea
                                                className="w-full p-2 border rounded h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.description_en}
                                                onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                                                placeholder="Detailed program description in English..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Description (FR)</label>
                                            <textarea
                                                className="w-full p-2 border rounded h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.description_fr}
                                                onChange={e => setFormData({ ...formData, description_fr: e.target.value })}
                                                placeholder="Description détaillée du programme en français..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Admission Requirements (EN)</label>
                                            <textarea
                                                className="w-full p-2 border rounded h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.admission_requirements_en}
                                                onChange={e => setFormData({ ...formData, admission_requirements_en: e.target.value })}
                                                placeholder="List admission requirements..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Admission Requirements (FR)</label>
                                            <textarea
                                                className="w-full p-2 border rounded h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.admission_requirements_fr}
                                                onChange={e => setFormData({ ...formData, admission_requirements_fr: e.target.value })}
                                                placeholder="Conditions d'admission..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Career Opportunities (EN)</label>
                                            <textarea
                                                className="w-full p-2 border rounded h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.career_opportunities_en}
                                                onChange={e => setFormData({ ...formData, career_opportunities_en: e.target.value })}
                                                placeholder="Possible career paths..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Career Opportunities (FR)</label>
                                            <textarea
                                                className="w-full p-2 border rounded h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.career_opportunities_fr}
                                                onChange={e => setFormData({ ...formData, career_opportunities_fr: e.target.value })}
                                                placeholder="Opportunités de carrière..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end space-x-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save Program
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
