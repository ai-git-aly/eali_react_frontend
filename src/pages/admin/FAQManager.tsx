import React, { useEffect, useState } from 'react';
import api, { FAQ } from '../../services/api';
import { Plus, Edit, Trash2, X, GripVertical } from 'lucide-react';

const FAQManager: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<FAQ | null>(null);
    const [formData, setFormData] = useState({
        question_en: '',
        question_fr: '',
        answer_en: '',
        answer_fr: '',
        order: 0
    });

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const response = await api.get('/faqs');
            setFaqs(response.data);
        } catch (err) {
            console.error('Failed to fetch FAQs', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/faqs/${editingItem.id}`, formData);
            } else {
                await api.post('/faqs', formData);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            setFormData({ question_en: '', question_fr: '', answer_en: '', answer_fr: '', order: 0 });
            fetchFaqs();
        } catch (err) {
            alert('Failed to save FAQ');
        }
    };

    const handleEdit = (item: FAQ) => {
        setEditingItem(item);
        setFormData({
            question_en: item.question_en,
            question_fr: item.question_fr,
            answer_en: item.answer_en,
            answer_fr: item.answer_fr,
            order: item.order
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            try {
                await api.delete(`/faqs/${id}`);
                setFaqs(faqs.filter(item => item.id !== id));
            } catch (err) {
                alert('Failed to delete FAQ');
            }
        }
    };

    const handleMove = async (id: number, direction: 'up' | 'down') => {
        const index = faqs.findIndex(f => f.id === id);
        if (direction === 'up' && index > 0) {
            const newOrder = faqs[index - 1].order;
            await api.put(`/faqs/${id}`, { order: newOrder });
            await api.put(`/faqs/${faqs[index - 1].id}`, { order: faqs[index].order });
            fetchFaqs();
        } else if (direction === 'down' && index < faqs.length - 1) {
            const newOrder = faqs[index + 1].order;
            await api.put(`/faqs/${id}`, { order: newOrder });
            await api.put(`/faqs/${faqs[index + 1].id}`, { order: faqs[index].order });
            fetchFaqs();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Manage Q&A</h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ question_en: '', question_fr: '', answer_en: '', answer_fr: '', order: faqs.length + 1 });
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    <span>Add Q&A</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 w-12 font-semibold text-gray-700">Order</th>
                            <th className="p-4 font-semibold text-gray-700">Question (EN)</th>
                            <th className="p-4 font-semibold text-gray-700">Question (FR)</th>
                            <th className="p-4 font-semibold text-gray-700">Answer (EN)</th>
                            <th className="p-4 font-semibold text-gray-700">Answer (FR)</th>
                            <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
                        ) : faqs.length === 0 ? (
                            <tr><td colSpan={6} className="p-4 text-center">No FAQs found.</td></tr>
                        ) : (
                            faqs.sort((a, b) => a.order - b.order).map((item, index) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleMove(item.id, 'up')}
                                                disabled={index === 0}
                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => handleMove(item.id, 'down')}
                                                disabled={index === faqs.length - 1}
                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            >
                                                ↓
                                            </button>
                                            <span className="ml-2 text-sm">{item.order}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm max-w-[200px] truncate">{item.question_en}</td>
                                    <td className="p-4 text-sm max-w-[200px] truncate">{item.question_fr}</td>
                                    <td className="p-4 text-sm max-w-[200px] truncate">{item.answer_en}</td>
                                    <td className="p-4 text-sm max-w-[200px] truncate">{item.answer_fr}</td>
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
                            <h3 className="text-xl font-bold">{editingItem ? 'Edit Q&A' : 'Add Q&A'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Question (EN)</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={formData.question_en}
                                        onChange={e => setFormData({ ...formData, question_en: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Question (FR)</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={formData.question_fr}
                                        onChange={e => setFormData({ ...formData, question_fr: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Answer (EN)</label>
                                <textarea
                                    className="w-full p-2 border rounded h-24"
                                    value={formData.answer_en}
                                    onChange={e => setFormData({ ...formData, answer_en: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Answer (FR)</label>
                                <textarea
                                    className="w-full p-2 border rounded h-24"
                                    value={formData.answer_fr}
                                    onChange={e => setFormData({ ...formData, answer_fr: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Display Order</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded"
                                    value={formData.order}
                                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    min="1"
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

export default FAQManager;
