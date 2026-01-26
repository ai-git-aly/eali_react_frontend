import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, X, FileText } from 'lucide-react';
import FileUpload from '../../components/FileUpload';

interface Tender {
    id: number;
    title_en: string;
    title_fr: string;
    description_en: string;
    description_fr: string;
    deadline: string;
    date_posted: string;
    fileUrl: string;
}

const TendersManager: React.FC = () => {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Tender | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        title_en: '',
        title_fr: '',
        description_en: '',
        description_fr: '',
        deadline: '',
        date_posted: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchTenders();
    }, []);

    const fetchTenders = async () => {
        try {
            const response = await api.get('/tenders');
            setTenders(response.data);
        } catch (err) {
            console.error('Failed to fetch tenders', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title_en', formData.title_en);
            data.append('title_fr', formData.title_fr);
            data.append('description_en', formData.description_en);
            data.append('description_fr', formData.description_fr);
            data.append('deadline', formData.deadline);
            data.append('date_posted', formData.date_posted);
            if (selectedFile) {
                data.append('file', selectedFile);
            }

            if (editingItem) {
                await api.put(`/tenders/${editingItem.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/tenders', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            setEditingItem(null);
            setSelectedFile(null);
            setFormData({
                title_en: '',
                title_fr: '',
                description_en: '',
                description_fr: '',
                deadline: '',
                date_posted: new Date().toISOString().split('T')[0],
            });
            fetchTenders();
        } catch (err) {
            alert('Failed to save tender');
        }
    };

    const handleEdit = (item: Tender) => {
        setEditingItem(item);
        setFormData({
            title_en: item.title_en,
            title_fr: item.title_fr,
            description_en: item.description_en,
            description_fr: item.description_fr,
            deadline: item.deadline,
            date_posted: item.date_posted,
        });
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this tender?')) {
            try {
                await api.delete(`/tenders/${id}`);
                setTenders(tenders.filter(item => item.id !== id));
            } catch (err) {
                alert('Failed to delete tender');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Manage Tenders</h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({
                            title_en: '',
                            title_fr: '',
                            description_en: '',
                            description_fr: '',
                            deadline: '',
                            date_posted: new Date().toISOString().split('T')[0],
                        });
                        setSelectedFile(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    <span>Add Tender</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-700">Title (EN)</th>
                            <th className="p-4 font-semibold text-gray-700">Deadline</th>
                            <th className="p-4 font-semibold text-gray-700">File</th>
                            <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
                        ) : tenders.length === 0 ? (
                            <tr><td colSpan={4} className="p-4 text-center">No tenders found.</td></tr>
                        ) : (
                            tenders.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4">{item.title_en}</td>
                                    <td className="p-4">{item.deadline}</td>
                                    <td className="p-4">
                                        {item.fileUrl ? (
                                            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center space-x-1">
                                                <FileText size={16} />
                                                <span>View PDF</span>
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">No file</span>
                                        )}
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
                            <h3 className="text-xl font-bold">{editingItem ? 'Edit Tender' : 'Add Tender'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title (EN)</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={formData.title_en}
                                        onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title (FR)</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={formData.title_fr}
                                        onChange={e => setFormData({ ...formData, title_fr: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description (EN)</label>
                                <textarea
                                    className="w-full p-2 border rounded h-24"
                                    value={formData.description_en}
                                    onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description (FR)</label>
                                <textarea
                                    className="w-full p-2 border rounded h-24"
                                    value={formData.description_fr}
                                    onChange={e => setFormData({ ...formData, description_fr: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Deadline</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border rounded"
                                        value={formData.deadline}
                                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date Posted</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border rounded"
                                        value={formData.date_posted}
                                        onChange={e => setFormData({ ...formData, date_posted: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tender Document (PDF)</label>
                                <FileUpload
                                    onFileSelect={setSelectedFile}
                                    accept=".pdf"
                                    label="Upload Tender PDF"
                                />
                                {editingItem?.fileUrl && !selectedFile && (
                                    <p className="text-xs text-gray-500 mt-1">Current file: {editingItem.fileUrl}</p>
                                )}
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

export default TendersManager;
