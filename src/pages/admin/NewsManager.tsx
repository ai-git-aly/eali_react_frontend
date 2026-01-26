import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import FileUpload from '../../components/FileUpload';

interface NewsItem {
    id: number;
    title_en: string;
    title_fr: string;
    description_en: string;
    description_fr: string;
    date: string;
    category: string;
    imageUrl?: string;
}

const NewsManager: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        title_en: '',
        title_fr: '',
        description_en: '',
        description_fr: '',
        date: new Date().toISOString().split('T')[0],
        category: 'General',
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await api.get('/news');
            setNews(response.data);
        } catch (err) {
            console.error('Failed to fetch news', err);
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
            data.append('date', formData.date);
            data.append('category', formData.category);
            if (selectedFile) {
                data.append('image', selectedFile);
            }

            if (editingItem) {
                await api.put(`/news/${editingItem.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/news', data, {
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
                date: new Date().toISOString().split('T')[0],
                category: 'General',
            });
            fetchNews();
        } catch (err) {
            alert('Failed to save news item');
        }
    };

    const handleEdit = (item: NewsItem) => {
        setEditingItem(item);
        setFormData({
            title_en: item.title_en,
            title_fr: item.title_fr,
            description_en: item.description_en,
            description_fr: item.description_fr,
            date: item.date,
            category: item.category,
        });
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                await api.delete(`/news/${id}`);
                setNews(news.filter(item => item.id !== id));
            } catch (err) {
                alert('Failed to delete news item');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Manage News</h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({
                            title_en: '',
                            title_fr: '',
                            description_en: '',
                            description_fr: '',
                            date: new Date().toISOString().split('T')[0],
                            category: 'General',
                        });
                        setSelectedFile(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    <span>Add News</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-700">Image</th>
                            <th className="p-4 font-semibold text-gray-700">Title (EN)</th>
                            <th className="p-4 font-semibold text-gray-700">Date</th>
                            <th className="p-4 font-semibold text-gray-700">Category</th>
                            <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                        ) : news.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center">No news items found.</td></tr>
                        ) : (
                            news.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        {item.imageUrl && (
                                            <img src={item.imageUrl} alt="" className="w-12 h-12 object-cover rounded" />
                                        )}
                                    </td>
                                    <td className="p-4">{item.title_en}</td>
                                    <td className="p-4">{item.date}</td>
                                    <td className="p-4">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                            {item.category}
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
                            <h3 className="text-xl font-bold">{editingItem ? 'Edit News' : 'Add News'}</h3>
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
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border rounded"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">News Image</label>
                                <FileUpload
                                    onFileSelect={setSelectedFile}
                                    accept="image/*"
                                    label="Upload News Image"
                                />
                                {editingItem?.imageUrl && !selectedFile && (
                                    <p className="text-xs text-gray-500 mt-1">Current image: {editingItem.imageUrl}</p>
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

export default NewsManager;
